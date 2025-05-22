// 導入 Anthony Fu 的 ESLint 配置
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    // 全域規則設定
    rules: {
      // 警告使用 console
      'no-console': 'warn',
      // 警告未使用的導入
      'unused-imports/no-unused-imports': 'warn',
      // 警告未使用的變量
      'unused-imports/no-unused-vars': 'warn',
      // 箭頭函數參數必須使用括號
      'style/arrow-parens': ['error', 'always'],
      // 介面和類型定義的分隔符樣式
      'style/member-delimiter-style': [
        'error',
        {
          // 多行定義使用分號
          multiline: {
            delimiter: 'semi',
            requireLast: true, // 最後一個屬性後需要分號
          },
          // 單行定義使用分號
          singleline: {
            delimiter: 'semi',
            requireLast: false, // 單行最後一個屬性不需要分號
          },
          // 使用括號檢測是否為多行
          multilineDetection: 'brackets',
        },
      ],
      // JSDoc 多行區塊規則
      'jsdoc/multiline-blocks': [
        'error',
        {
          noZeroLineText: false, // 允許註釋區塊首尾沒有空行
        },
      ],
      // 導出排序規則
      'perfectionist/sort-exports': [
        'error',
        {
          partitionByNewLine: true, // 按換行分組排序
        },
      ],
    },
  },
  // Vue 文件特定規則
  {
    files: ['**/*.vue'],
    rules: {
      // Vue 模板中組件命名規範
      'vue/component-name-in-template-casing': [
        'error',
        'kebab-case', // 使用短橫線命名法 (my-component)
        {
          registeredComponentsOnly: true, // 只檢查已註冊的組件
          ignores: [], // 沒有忽略的組件
        },
      ],
      // Vue 文件區塊順序
      'vue/block-order': [
        'error',
        {
          order: [['script', 'template'], 'style'], // script/template 優先，然後是 style
        },
      ],
    },
  },
  // JSON 文件特定規則
  {
    files: ['**/*.json'],
    rules: {
      // 關閉 JSON 文件末尾必須有空行的規則
      'style/eol-last': 'off',
    },
  },
)
