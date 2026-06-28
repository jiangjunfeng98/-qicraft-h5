import { defineConfig } from 'vite';
import { resolve } from 'path';

// GitHub Pages 仓库路径（用于生产构建）
const GH_PAGES_BASE = '/-qicraft-h5/';

// 多页应用：五个 HTML 入口
export default defineConfig(({ mode }) => ({
  root: '.',
  base: mode === 'production' ? GH_PAGES_BASE : './',
  server: {
    host: true,
    port: 5173,
    open: '/index.html'
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        detail: resolve(__dirname, 'artifact-detail.html'),
        kiln: resolve(__dirname, 'kiln-chronicle.html'),
        about: resolve(__dirname, 'about.html'),
        dna: resolve(__dirname, 'kiln-dna.html')
      }
    }
  }
}));
