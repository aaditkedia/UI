import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Repo is hosted at github.com/aaditkedia/UI → Pages serves at /UI/.
// Override with VITE_BASE=/ for local previews if needed.
const base = process.env.VITE_BASE ?? "/UI/";

export default defineConfig({
  base,
  plugins: [react()],
});
