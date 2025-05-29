<template>
  <div class="flex flex-col gap-4 w-full border border-gray-300 p-6 text-black">
        <nested-fuzzy-search
      ref="searchComponent"
      v-model="internalSearchQuery"
      class=" rounded p-4 bg-gray-300"
      :data="data"
      :matchPrecision="threshold"
      :autoEmitResults="false"
      placeholder="輸入後點擊搜尋..."
      @search="handleSearchResults"
    />
    
    <!-- matchPrecision 控制滑桿 -->
    <div class="flex flex-col gap-2 p-4 bg-blue-50 rounded border">
      <div class="flex items-center justify-between">
        <label class="text-sm font-medium text-gray-700">
          匹配相似度 (matchPrecision): {{ threshold.toFixed(2) }}
        </label>
        <span class="text-xs text-gray-500">
          {{ threshold <= 0.1 ? '最低' : threshold <= 0.3 ? '低' : threshold <= 0.6 ? '中等' : threshold <= 0.8 ? '高' : '最高' }}
        </span>
      </div>
      <input
        v-model.number="threshold"
        type="range"
        min="0.1"
        max="1"
        step="0.1"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div class="flex justify-between text-xs text-gray-400">
        <span>0.1 (寬鬆)</span>
        <span>1.0 (嚴格)</span>
      </div>
    </div>

    <!-- 搜尋輸入框和按鈕 -->
    <div class="flex  justify-end gap-4">
      <button
        @click="performSearch"
        class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        搜尋
      </button>
      <button
        @click="clearSearch"
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
      >
        清空
      </button>
    </div>

    <!-- 顯示搜尋結果 -->
    <div v-if="searchResults.length > 0" class="mt-4">
      <div class="text-lg font-semibold mb-2 bg-gray-200 p-2 rounded text-green-600">
        搜尋結果 ({{ searchResults.length }} 項):
      </div>
      <div class="space-y-3">
        <div
          v-for="item in searchResults"
          :key="item.id"
          class="p-4 bg-gray-50 rounded border"
        >
          <h4 class="font-bold text-black mb-2">
            {{ item.title }}
          </h4>
          
          <!-- 關鍵字標籤 -->
          <div class="flex flex-wrap gap-1 mb-2">
            <span
              v-for="keyword in item.keywords"
              :key="keyword"
              class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
            >
              {{ keyword }}
            </span>
          </div>
          
          <!-- 作者資訊 -->
          <div class="text-sm text-gray-600 mb-2">
            <span class="font-medium">作者：</span>{{ item.author.name }}
            <span class="text-gray-400 ml-2">({{ item.author.email }})</span>
          </div>
          
          <!-- 章節資訊 -->
          <div class="text-xs text-gray-500">
            <span class="font-medium">章節：</span>
            <span v-for="(chapter, index) in item.chapters" :key="chapter.name">
              {{ chapter.name }} ({{ chapter.duration }}分)
              <span v-if="index < item.chapters.length - 1"> • </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 當沒有結果時顯示 -->
    <div v-else-if="hasSearched && searchResults.length === 0" class="bg-red-100 mt-4 p-3 rounded text-lg font-semibold ">
      <div class="text-red-600">
        沒有符合條件的結果
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import NestedFuzzySearch from '../nested-fuzzy-search.vue'

// 範例資料
interface DataItem {
  id: number;
  title: string;
  keywords: string[];
  author: {
    name: string;
    email: string;
  };
  chapters: Array<{
    name: string;
    duration: number;
  }>;
}

const data: DataItem[] = [
  {
    id: 1,
    title: 'Vue.js 完整開發指南',
    keywords: ['Vue', 'JavaScript', '前端', 'SPA'],
    author: {
      name: '張小明',
      email: 'zhang@example.com'
    },
    chapters: [
      { name: '基礎概念', duration: 120 },
      { name: 'Composition API', duration: 180 },
      { name: '狀態管理', duration: 150 }
    ]
  },
  {
    id: 2,
    title: 'React 效能優化實戰',
    keywords: ['React', 'Performance', '優化'],
    author: {
      name: '李美華',
      email: 'li@example.com'
    },
    chapters: [
      { name: 'Virtual DOM 原理', duration: 90 },
      { name: 'Memo 與 Callback', duration: 110 },
      { name: '代碼分割', duration: 100 }
    ]
  },
  {
    id: 3,
    title: 'Node.js 後端開發',
    keywords: ['Node.js', 'Express', 'API', '後端'],
    author: {
      name: '王大安',
      email: 'wang@example.com'
    },
    chapters: [
      { name: 'Express 框架', duration: 140 },
      { name: 'MongoDB 整合', duration: 160 },
      { name: 'Authentication', duration: 130 }
    ]
  },
  {
    id: 4,
    title: 'Python 資料科學',
    keywords: ['Python', '資料分析', 'Pandas', 'NumPy'],
    author: {
      name: '陳志強',
      email: 'chen@example.com'
    },
    chapters: [
      { name: 'Pandas 基礎', duration: 200 },
      { name: '資料視覺化', duration: 170 },
      { name: '機器學習入門', duration: 220 }
    ]
  },
  {
    id: 5,
    title: 'Docker 容器化部署',
    keywords: ['Docker', 'DevOps', '容器', '部署'],
    author: {
      name: '林雅婷',
      email: 'lin@example.com'
    },
    chapters: [
      { name: 'Docker 基礎', duration: 80 },
      { name: 'Dockerfile 撰寫', duration: 95 },
      { name: 'Docker Compose', duration: 120 }
    ]
  },
  {
    id: 6,
    title: 'TypeScript 進階開發',
    keywords: ['TypeScript', '型別', '進階', 'JavaScript'],
    author: {
      name: '吳建宏',
      email: 'wu@example.com'
    },
    chapters: [
      { name: '型別系統', duration: 110 },
      { name: '泛型程式設計', duration: 140 },
      { name: '裝飾器模式', duration: 90 }
    ]
  },
  {
    id: 7,
    title: 'Swift iOS 應用開發',
    keywords: ['Swift', 'iOS', '行動應用', 'UIKit'],
    author: {
      name: '黃淑芬',
      email: 'huang@example.com'
    },
    chapters: [
      { name: 'Swift 語法', duration: 160 },
      { name: 'UIKit 元件', duration: 180 },
      { name: '資料持久化', duration: 120 }
    ]
  },
  {
    id: 8,
    title: 'Kubernetes 集群管理',
    keywords: ['Kubernetes', 'K8s', '容器編排', 'DevOps'],
    author: {
      name: '許志明',
      email: 'hsu@example.com'
    },
    chapters: [
      { name: '基本概念', duration: 100 },
      { name: 'Pod 與 Service', duration: 150 },
      { name: '部署策略', duration: 170 }
    ]
  },
  {
    id: 9,
    title: '機器學習演算法',
    keywords: ['AI', '機器學習', '演算法', 'TensorFlow'],
    author: {
      name: '劉小敏',
      email: 'liu@example.com'
    },
    chapters: [
      { name: '監督式學習', duration: 240 },
      { name: '神經網路', duration: 200 },
      { name: '深度學習', duration: 280 }
    ]
  },
  {
    id: 10,
    title: 'Web 安全防護',
    keywords: ['安全', 'HTTPS', 'XSS', 'CSRF'],
    author: {
      name: '鄭大衛',
      email: 'zheng@example.com'
    },
    chapters: [
      { name: '常見攻擊手法', duration: 130 },
      { name: '防護機制', duration: 150 },
      { name: '安全測試', duration: 110 }
    ]
  }
]

// 搜尋相關狀態
const searchComponent = ref()
const internalSearchQuery = ref('')
const currentSearchQuery = ref('')
const searchResults = ref<DataItem[]>([])
const threshold = ref(0.1) 
const hasSearched = ref(false)


// 執行搜尋
function performSearch() {
  if (internalSearchQuery.value.trim()) {
    currentSearchQuery.value = internalSearchQuery.value
    hasSearched.value = true
    // 手動觸發搜尋組件的搜尋
    searchComponent.value?.triggerSearch()
  }
}


// 清空搜尋
function clearSearch() {
  internalSearchQuery.value = ''
  currentSearchQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
}

// 處理搜尋結果
function handleSearchResults(results: DataItem[]) {
  searchResults.value = results
}

// 監聽內部搜尋查詢變化
watch(internalSearchQuery, (newValue) => {
  if (newValue === '') {
    currentSearchQuery.value = ''
    searchResults.value = []
    hasSearched.value = false
  }
})
</script>
