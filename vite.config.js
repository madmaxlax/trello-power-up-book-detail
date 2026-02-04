import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base path for assets
  base: './',

  // Define multiple HTML entry points
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        searchBooks: resolve(__dirname, 'search-books.html'),
        cardBackSection: resolve(__dirname, 'card-back-section.html'),
      },
    },
    outDir: 'dist',
    // Disable minification for easier reading
    minify: false,
    // Keep CSS readable too
    cssMinify: false,
  },

  // Environment variable prefix - only variables starting with VITE_ will be exposed
  envPrefix: 'VITE_',

  // Dev server configuration
  server: {
    port: 3000,
    open: false,
  },

  // Define global constants that will be replaced at build time
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});
