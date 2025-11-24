import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // 跨域代理配置
        proxy: {
          // 匹配所有以"/api"开头的请求
          '/api': {
            target: env.VITE_API_BASE_URL,  // 后端服务地址
            changeOrigin: true,             // 允许跨域
            rewrite: (path) => path.replace(/^\/api/, ''), // 若后端接口无“/api”前缀，需删除
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
