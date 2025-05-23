import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
// https://vitejs.dev/config/
// defineConfig(({ command, mode })
export default defineConfig(() => {
  return {
    plugins: [vue()],
    test: {
      globals: true,
      environment: 'happy-dom',
      reporter: ['default'], // 可加入html產生報告
      include: ['src/**/*.{test,spec}.ts'], // 只包含這些檔案
    },
  }
})
