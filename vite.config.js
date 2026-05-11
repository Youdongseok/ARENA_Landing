import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const buildTimestamp = new Date().getTime(); // 💡 현재 시간으로 해시 강제 변경

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve('./src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('react-router')) return 'vendor-router';
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (id.includes('@tanstack/react-query')) return 'vendor-query';
          if (id.includes('recharts')) return 'vendor-charts';
          if (id.includes('zustand')) return 'vendor-state';
          if (id.includes('axios')) return 'vendor-network';
          if (id.includes('react-hot-toast')) return 'vendor-ui';
          if (id.includes('canvas-confetti')) return 'vendor-effects';
          if (id.includes('@heroicons/react')) return 'vendor-icons';
          if (id.includes('/react/') || id.includes('react-dom')) return 'vendor-react';

          return 'vendor';
        },
        // 💡 매 빌드마다 새로운 파일명 생성
        entryFileNames: `assets/[name]-${buildTimestamp}.js`,
        chunkFileNames: `assets/[name]-${buildTimestamp}.js`,
        assetFileNames: `assets/[name]-${buildTimestamp}.[ext]`,
      },
    },
  },
});
