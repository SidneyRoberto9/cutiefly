import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
  },
})
