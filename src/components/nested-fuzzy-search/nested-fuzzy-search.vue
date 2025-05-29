<template>
  <!-- 搜尋輸入框 -->
  <input
    v-model="searchQuery"
    type="text"
    :placeholder="placeholder"
    class="search-input"
  >
</template>

<script setup lang="ts">
import type { ModelRef, Ref } from 'vue'
import { computed, watchEffect } from 'vue'
import { useDebounce } from './useDebounce'

interface Props {
  data: any[]; // 要搜尋的資料陣列
  placeholder?: string; // 輸入框的提示文字
  matchPrecision?: number; // 相似度閾值，範圍 0-1，預設為 0.3
  autoEmitResults?: boolean; // 是否自動發送搜尋結果，預設為 true
  debounceMs?: number; // 防抖延遲時間（毫秒），預設為 300
}

// 定義 props - 組件接收的屬性
const props = withDefaults(defineProps<Props>(), {
  placeholder: '請輸入搜尋關鍵字', // 預設提示文字
  matchPrecision: 0.3, // 預設相似度閾值
  autoEmitResults: true, // 預設自動發送搜尋結果
  debounceMs: 300, // 預設防抖延遲時間
})

const emit = defineEmits<{
  search: [results: any[]]; // 搜尋結果事件
}>()

// 搜尋查詢字串 - 支援 v-model 雙向綁定
const searchQuery: ModelRef<string> = defineModel({ default: '' })

// 使用防抖處理搜尋查詢
const debouncedSearchQuery = useDebounce(searchQuery, props.debounceMs)

/**
 * 1.生成字串的 N-gram
 * 原理：將文字分割成連續 n 個字符的技術，用於後面模糊搜尋使用
 * @param str 輸入字串 - 要分析的原始字串
 * @param n N-gram 的大小 - 默認為 2，表示生成二元組（bigram）
 * @returns N-gram 陣列 - 包含所有連續字符片段的陣列
 * @example
 * getNGrams("hello", 2) // ["he", "el", "ll", "lo"]
 * getNGrams("hello", 3) // ["hel", "ell", "llo"]
 */
function getNGrams(str: string, n: number = 2): string[] {
  const grams: string[] = []
  for (let i = 0; i <= str.length - n; i++) {
    grams.push(str.slice(i, i + n))
  }
  return grams
}

/**
 * 2. 針對N-gram 模糊搜尋算法
 * 透過比較兩個字串的 N-gram 重疊程度來計算相似度
 * 相似度越高表示兩個字串越相似，用於實現容錯搜尋
 * @param targetString 目標字串 - 被搜尋的字串（資料中的值）
 * @param queryString 查詢字串 - 用戶輸入的搜尋關鍵字
 * @param n N-gram 的大小 - 默認為 2，表示使用二元組（bigram）進行比較
 * @returns 返回相似度分數（會在0-1 之間）- 數字越接近 1，表示越相似
 * @example
 * getNGramMatchScore("hello", "hello") // 1.0
 * getNGramMatchScore("hello", "ell") // 約0.5
 */
function getNGramMatchScore(targetString: string, queryString: string, n: number = 2): number {
  const targetLower = targetString.toLowerCase()
  const queryLower = queryString.toLowerCase()
  
  // 處理短字串的情況
  if (queryLower.length === 1) {
    // 單字符：給予較低的基礎分數，避免太多雜訊
    return targetLower.includes(queryLower) ? 0.3 : 0
  }
  
  if (targetLower.length < n || queryLower.length < n) {
    // 字串太短無法生成 N-gram，使用字串包含判斷
    return targetLower.includes(queryLower) ? 0.8 : 0
  }
  
  // 完全匹配給予滿分
  if (targetLower === queryLower) return 1.0
  
  const targetGrams = getNGrams(targetLower, n)
  const queryGrams = getNGrams(queryLower, n)
  
  const intersection = targetGrams.filter((gram) => queryGrams.includes(gram))
  
  const queryCoverage = intersection.length / queryGrams.length 
  const targetCoverage = intersection.length / targetGrams.length 
  
  if (queryCoverage + targetCoverage === 0) return 0
  
  let score = (2 * queryCoverage * targetCoverage) / (queryCoverage + targetCoverage)
  
  // 給予字串包含關係額外加分
  if (targetLower.includes(queryLower)) {
    score = Math.min(score + 0.2, 1.0)
  }
  
  return score
}

/**
 * 根據 path 提供的路徑，取得物件中的值
 * （支援巢狀物件和陣列，如：user.profile.name 或 users[0].name）
 * @param item 源物件 - 要從中提取值的物件
 * @param path 欄位路徑 - 點記法或方括號記法的路徑字串
 * @returns 欄位對應的值 - 如果路徑不存在則返回 null
 * @example
 * getValueByPath({ user: { profile: { name: 'Alice' } } }, 'user.profile.name') // 'Alice'
 * getValueByPath({ users: [{ name: 'Bob' }] }, 'users[0].name') // 'Bob'
 */
function getValueByPath(item: any, path: string): any {
  // 將路徑字串分割成鍵陣列，支援 . 和 [] 符號
  // 例如：'user.profile[0].name' -> ['user', 'profile', '0', 'name']
  const keys = path.split(/[.[\]]/).filter(Boolean)
  let value = item
  // 逐層深入物件結構
  for (const key of keys) {
    // 如果當前值為 null 或 undefined，停止搜尋
    if (value == null)
      return null
    // 取得下一層的值
    value = value[key]
  }
  return value
}

/**
 * 以遞迴方式取得item的所有「鍵」
 * （支援巢狀物件、陣列、日期等資料結構）
 * @param item 要分析的物件 - 源資料物件
 * @param prefix 欄位路徑前綴 - 用於建構完整的欄位路徑
 * @returns 所有可搜尋欄位的陣列 - 包含完整路徑的字串陣列
 * @example
 * getAllKeys({ user: { name: 'Alice', age: 30 }, tags: ['vue', 'javascript'] }) // ['user.name', 'user.age', 'tags[0]', 'tags[1]']
 * getAllKeys({ date: new Date(), nested: { value: 42 } }) // ['date', 'nested.value']
 */
function getAllKeys(item: any, prefix = ''): string[] {
  const itemKeyPaths: string[] = []

  // 如果不是物件類型（本條件包含array)，直接返回空陣列
  if (!item || typeof item !== 'object')
    return itemKeyPaths

  // 遍歷物件的所有屬性
  for (const key of Object.keys(item)) {
    const value = item[key]
    // 建構當前欄位的完整路徑，如果有前綴，就用 . 連接（遞迴時觸發）
    const KeyPath = prefix ? `${prefix}.${key}` : key

    // 如果是 陣列：要先判斷陣列內部成員
    if (Array.isArray(value)) {
      value.forEach((arrayItem, index) => {
        if (arrayItem && typeof arrayItem === 'object' && !(arrayItem instanceof Date)) {
          // 判斷1:物件，繼續遞迴
          itemKeyPaths.push(...getAllKeys(arrayItem, `${KeyPath}[${index}]`))
        }
        else {
          // 判斷2:基本類型，直接添加
          itemKeyPaths.push(`${KeyPath}[${index}]`)
        }
      })
    }

    // 如果是 日期物件：直接添加欄位路徑
    else if (value instanceof Date) {
      itemKeyPaths.push(KeyPath)
    }
    // 如果是 巢狀物件：遞迴獲取其欄位
    else if (value && typeof value === 'object') {
      itemKeyPaths.push(...getAllKeys(value, KeyPath))
    }
    // 如果是 基本類型：直接添加欄位路徑
    else {
      itemKeyPaths.push(KeyPath)
    }
  }
  return itemKeyPaths
}

/**
 * 由於N-gram比對是基於字串進行，所以比對前要確保各種資料類型都能轉換為字串格式
 * （流程不會出現陣列跟物件）
 * @param value 要轉換的資料（可以是任何 JS 資料類型）
 * @returns 轉換後的字串
 * @example
 * convertToString(new Date()) // '2023-10-01T00:00:00.000Z'
 * convertToString(true) // 'true'
 * convertToString(42) // '42'
 */
function convertToString(value: any): string {
  // 日期物件，轉換為 ISO 字串格式
  if (value instanceof Date)
    return value.toISOString()
  // 布林值，轉換為 'true' 或 'false'
  if (typeof value === 'boolean')
    return value ? 'true' : 'false'
  // 其他類型直接使用 String() 轉換
  return String(value)
}

/**
 * 根據查詢字串，生成一個函數，可用於檢查是否匹配
 * (該函數是提供給 「 原始資料.filter() 」 使用的)
 * @param queryString 已去除前後空白的查詢字串 - 用戶輸入的搜尋關鍵字
 * @returns 返回一個函數，接受一個item並返回是否與queryString匹配的布林值
 */
function isItemMatchedMaker(queryString) {
  return function isItemMatched(item: any): boolean {
  // 獲取當前項目的所有可搜尋欄位路徑
    const fieldsArray = getAllKeys(item)

    // 檢查是否有任何欄位與查詢字串匹配
    return fieldsArray.some((field) => {
    // 獲取欄位的值
      const fieldValue = getValueByPath(item, field)
      // 如果欄位值為空，跳過
      if (fieldValue == null)
        return false

      // 將欄位值轉換為小寫字串
      const stringValue = convertToString(fieldValue).toLowerCase()
      // 設定相似度閾值（0.3 表示 20% 相似度）
      const matchPrecision = props.matchPrecision
      const score = getNGramMatchScore(stringValue, queryString)
      // 返回是否達到閾值
      return score >= matchPrecision
    })
  }
}

// 計算搜尋結果 - 當查詢字串或資料變化時自動重新計算
const results: Ref<any[]> = computed(() => {
  // 去除查詢字串的前後空白並轉為小寫
  const trimmedQuery = debouncedSearchQuery.value.trim().toLowerCase()

  // 如果沒有查詢字串，就不反回任何結果
  if (!trimmedQuery)
    return []
  const ItemMatchedFn = isItemMatchedMaker(trimmedQuery)
  // 返回匹配的項目
  return props.data.filter(ItemMatchedFn)
})

/**
 * 手動觸發搜尋結果發送
 * 當 autoEmitResults 為 false 時，可以調用此方法手動發送搜尋結果
 */
function triggerSearch() {
  emit('search', results.value)
}

// 監聽搜尋結果變更，根據 autoEmitResults 決定是否自動發送事件給父元件
watchEffect(() => {
  if (props.autoEmitResults) {
    emit('search', results.value)
  }
})

// 導出方法供外部調用
defineExpose({
  triggerSearch, // 手動觸發搜尋結果發送的方法
  results, // 當前的搜尋結果（只讀）
})
</script>
