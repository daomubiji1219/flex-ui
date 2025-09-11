import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 添加优化配置
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion',
      'lodash-es',
    ],
    exclude: ['@storybook/*'], // 排除 Storybook 相关包
  },
  server: {
    fs: {
      allow: ['..', '..'],
    },
  },
  // 缓存配置
  cacheDir: 'node_modules/.vite',
});
