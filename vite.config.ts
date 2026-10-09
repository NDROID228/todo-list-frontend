import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Look for test files under the top-level test/ folder
    include: ["test/**/*.test.{ts,tsx}", "test/**/*.spec.{ts,tsx}"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "c8",
      reporter: ["text", "html"],
      all: true,
      lines: 90,
      functions: 85,
      branches: 80,
    },
  },
})
