// vite.config.js - Vite configuration for React app
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      // Enable JSX in .js files (for compatibility)
      include: '**/*.{jsx,js}',
    }),
  ],
  
  // Base path for production (empty for root)
  base: '/',
  
  // Build configuration
  build: {
    // Output directory (Vite default is 'dist')
    outDir: 'dist',
    
    // Build options
    emptyOutDir: true,
    
    // Generate source maps for production (set to true for debugging)
    sourcemap: false,
    
    // Chunk size warning limit (in kbs)
    chunkSizeWarningLimit: 1000,
    
    // Ensure index.html is in the root of dist
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  
  // Server configuration (for development)
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Proxy API requests to backend during development
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  
  // Preview server configuration (for testing production build)
  preview: {
    port: 3000,
    open: true,
  },
  
  // Public directory
  publicDir: 'public',
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Environment variables
  envPrefix: 'VITE_',
});

