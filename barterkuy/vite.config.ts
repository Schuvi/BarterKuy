import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: './localhost-key.pem',  // Kosongkan jika tidak ada sertifikat, atau tambahkan jalur ke sertifikat
      cert: './localhost.pem', // Kosongkan jika tidak ada sertifikat, atau tambahkan jalur ke sertifikat
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
