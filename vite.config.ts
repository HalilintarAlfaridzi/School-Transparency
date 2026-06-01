import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/School-Transparency/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react") || id.includes("react-router-dom")) return "react";
          if (id.includes("recharts")) return "charts";
          if (id.includes("lucide-react")) return "icons";
          return undefined;
        },
      },
    },
  },
});