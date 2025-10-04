import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  coverage: {
    reporter: ['text', 'lcov'],
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
})