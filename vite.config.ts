import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "kanban-widget.es.js"
    },
    rollupOptions: {
      external: ["react", "react-dom","@xyflow/react"]
    }
  }
});