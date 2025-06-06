<template>
  <div class="flex flex-col gap-4 w-full border border-gray-300 p-6">
    <span>輸入: vue, react等文字（並嘗試打錯幾個字母）</span>
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
    <div v-else-if="searchResults.length === 0 && searchQuery.length !== 0" class="bg-red-100 mt-4 p-3 rounded text-lg font-semibold ">
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
    title: 'Complete Vue.js Development Guide',
    keywords: ['Vue', 'JavaScript', 'Frontend', 'SPA'],
    author: {
      name: 'John Smith',
      email: 'john@example.com',
    },
    chapters: [
      { name: 'Basic Concepts', duration: 120 },
      { name: 'Composition API', duration: 180 },
      { name: 'State Management', duration: 150 },
    ],
  },
  {
    id: 2,
    title: 'React Performance Optimization',
    keywords: ['React', 'Performance', 'Optimization'],
    author: {
      name: 'Emily Johnson',
      email: 'emily@example.com',
    },
    chapters: [
      { name: 'Virtual DOM Principles', duration: 90 },
      { name: 'Memo and Callback', duration: 110 },
      { name: 'Code Splitting', duration: 100 },
    ],
  },
  {
    id: 3,
    title: 'Node.js Backend Development',
    keywords: ['Node.js', 'Express', 'API', 'Backend'],
    author: {
      name: 'Michael Brown',
      email: 'michael@example.com',
    },
    chapters: [
      { name: 'Express Framework', duration: 140 },
      { name: 'MongoDB Integration', duration: 160 },
      { name: 'Authentication', duration: 130 },
    ],
  },
  {
    id: 4,
    title: 'Python Data Science',
    keywords: ['Python', 'Data Analysis', 'Pandas', 'NumPy'],
    author: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
    },
    chapters: [
      { name: 'Pandas Basics', duration: 200 },
      { name: 'Data Visualization', duration: 170 },
      { name: 'Machine Learning Intro', duration: 220 },
    ],
  },
  {
    id: 5,
    title: 'Docker Containerization',
    keywords: ['Docker', 'DevOps', 'Container', 'Deployment'],
    author: {
      name: 'David Lee',
      email: 'david@example.com',
    },
    chapters: [
      { name: 'Docker Basics', duration: 80 },
      { name: 'Dockerfile Writing', duration: 95 },
      { name: 'Docker Compose', duration: 120 },
    ],
  },
  {
    id: 6,
    title: 'Advanced TypeScript Development',
    keywords: ['TypeScript', 'Types', 'Advanced', 'JavaScript'],
    author: {
      name: 'Alex Chen',
      email: 'alex@example.com',
    },
    chapters: [
      { name: 'Type System', duration: 110 },
      { name: 'Generic Programming', duration: 140 },
      { name: 'Decorator Pattern', duration: 90 },
    ],
  },
  {
    id: 7,
    title: 'Swift iOS App Development',
    keywords: ['Swift', 'iOS', 'Mobile App', 'UIKit'],
    author: {
      name: 'Lisa Garcia',
      email: 'lisa@example.com',
    },
    chapters: [
      { name: 'Swift Syntax', duration: 160 },
      { name: 'UIKit Components', duration: 180 },
      { name: 'Data Persistence', duration: 120 },
    ],
  },
  {
    id: 8,
    title: 'Kubernetes Cluster Management',
    keywords: ['Kubernetes', 'K8s', 'Orchestration', 'DevOps'],
    author: {
      name: 'Robert Martinez',
      email: 'robert@example.com',
    },
    chapters: [
      { name: 'Basic Concepts', duration: 100 },
      { name: 'Pods and Services', duration: 150 },
      { name: 'Deployment Strategies', duration: 170 },
    ],
  },
  {
    id: 9,
    title: 'Machine Learning Algorithms',
    keywords: ['AI', 'Machine Learning', 'Algorithms', 'TensorFlow'],
    author: {
      name: 'Amy Zhang',
      email: 'amy@example.com',
    },
    chapters: [
      { name: 'Supervised Learning', duration: 240 },
      { name: 'Neural Networks', duration: 200 },
      { name: 'Deep Learning', duration: 280 },
    ],
  },
  {
    id: 10,
    title: 'Web Security Protection',
    keywords: ['Security', 'HTTPS', 'XSS', 'CSRF'],
    author: {
      name: 'Kevin Anderson',
      email: 'kevin@example.com',
    },
    chapters: [
      { name: 'Common Attack Methods', duration: 130 },
      { name: 'Defense Mechanisms', duration: 150 },
      { name: 'Security Testing', duration: 110 },
    ],
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
