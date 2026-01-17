import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';  // ← ADD THIS

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    viteStaticCopy({  // ← ADD THIS BLOCK
      targets: [{
        src: '_redirects',
        dest: './public'  // ← Goes to dist/public (your Netlify publish dir)
      }]
    }),
    ...(process.env.NODE_ENV !== 'production' && process.env.REPL_ID !== undefined
      ? [await import('@replit/vite-plugin-cartographer').then((m) => m.cartographer())]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'client', 'src'),
      '@shared': path.resolve(import.meta.dirname, 'shared'),
      '@assets': path.resolve(import.meta.dirname, 'attached_assets'),
    },
  },
  root: path.resolve(import.meta.dirname, 'client'),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),  // ← Netlify publish dir ✓
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ['**/.*'],
    },
  },
});
