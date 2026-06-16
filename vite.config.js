import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Проект исторически держит JSX в .js файлах (наследие CRA),
// поэтому учим esbuild парсить их как JSX.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: "build",
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { ".js": "jsx" },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
