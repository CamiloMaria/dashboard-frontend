import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    define: {
      'process.env': env
    },
    plugins: [react()],
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'core': ['react', 'react-dom'],
            'radix': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-aspect-ratio',
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-collapsible',
              '@radix-ui/react-context-menu',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-hover-card',
              '@radix-ui/react-label',
              '@radix-ui/react-menubar',
              '@radix-ui/react-navigation-menu',
              '@radix-ui/react-popover',
              '@radix-ui/react-progress',
              '@radix-ui/react-radio-group',
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slider',
              '@radix-ui/react-slot',
              '@radix-ui/react-switch',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast',
              '@radix-ui/react-toggle',
              '@radix-ui/react-toggle-group',
              '@radix-ui/react-tooltip'
            ],
            'tiptap': [
              '@tiptap/extension-text-align',
              '@tiptap/extension-underline',
              '@tiptap/react',
              '@tiptap/starter-kit'
            ],
            'form': [
              'react-hook-form',
              '@hookform/resolvers',
              'zod'
            ],
            'utils': [
              'date-fns',
              'clsx',
              'class-variance-authority',
              'tailwind-merge',
              'lucide-react'
            ],
            'tanstack': [
              '@tanstack/react-query',
              '@tanstack/react-router',
              '@tanstack/react-virtual'
            ],
            'i18n': [
              'i18next',
              'react-i18next'
            ],
            'charts': [
              'recharts',
              'd3-scale',
              'd3-shape'
            ],
            'data': [
              '@tanstack/react-query-devtools'
            ]
          }
        },
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
