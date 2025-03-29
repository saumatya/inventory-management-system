import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // ✅ Allows using test() without explicit import
    environment: "jsdom", // ✅ Simulates browser environment
  },
});
