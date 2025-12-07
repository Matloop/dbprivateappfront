import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { fileURLToPath } from "url"

// Isso recria o __dirname que falta nos módulos modernos
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})