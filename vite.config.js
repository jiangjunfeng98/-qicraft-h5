import { defineConfig } from 'vite';
import { resolve } from 'path';

// 多页应用：三个 HTML 入口，Vite dev 直接访问 / 即首页
export default defineConfig({
  root: '.',
  base: './',
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
});
