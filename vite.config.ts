/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-04-27 09:06:01
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-04-27 18:34:30
 * @FilePath: /virtualization-platform/vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { defineConfig as defineVitestConfig } from 'vitest/config';

// 结合 Vite 和 Vitest 配置
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: '@root-entry-name: default;',
        modifyVars: {
          'primary-color': '#1890ff', // 主题色
          'link-color': '#1890ff', // 链接色
          'success-color': '#52c41a', // 成功色
          'warning-color': '#faad14', // 警告色
          'error-color': '#f5222d', // 错误色
          'border-radius-base': '2px', // 组件/浮层圆角
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // 配置代理
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
