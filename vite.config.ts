import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    base: "/",
    server: {
      port: 3000,
      host: "0.0.0.0",
      open: true,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            animations: ["framer-motion"],
            editor: ["@tiptap/react", "@tiptap/starter-kit", "@tiptap/extension-link"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  };
});
