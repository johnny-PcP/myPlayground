<template>
  <div class="flex flex-col gap-4 w-full border border-gray-300 p-6">
    <!-- 基本的搜尋元件使用 -->
    <nested-fuzzy-search
      v-model="searchQuery"
      class="bg-gray-300 rounded p-4 text-black"
      :data="data"
      placeholder="輸入關鍵字直接搜尋..."
      @search="handleSearchResults"
    />
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
    <div v-else-if="searchResults.length === 0 && searchQuery.length !==0" class="bg-red-100 mt-4 p-3 rounded text-lg font-semibold ">
      <div class="text-red-600">
        沒有符合條件的結果
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
]

// 搜尋結果和狀態
const searchQuery = ref('')
const searchResults = ref<DataItem[]>([])

// 處理搜尋結果
function handleSearchResults(results: DataItem[]) {
  searchResults.value = results
}
</script>
