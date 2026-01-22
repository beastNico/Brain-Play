import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Buffer } from 'buffer'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  define: {
    global: {
      Buffer: Buffer,
    },
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        ...configDefaults.coverage.exclude || [],
        '**/__tests__/**',
        '**/*.{config,setup}.ts'
      ]
    }
  }
});
