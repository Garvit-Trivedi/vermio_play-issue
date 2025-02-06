import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "c4e6-2409-40c1-3007-4f4c-f139-1c9d-2cb5-7f9f.ngrok-free.app",
      "c4e6-2409-40c1-3007-4f4c-f139-1c9d-2cb5-7f9f.ngrok-free.app"
    ],
  },
});
