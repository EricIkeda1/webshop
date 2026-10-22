import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { handleApi } from "./server/api.mjs";
export default defineConfig({
  plugins: [
    react(),
    {
      name: "eyi-server-api",
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          handleApi(request, response)
            .then((handled) => {
              if (!handled) next();
            })
            .catch(next);
        });
      },
    },
  ],
  server: {
    allowedHosts: ["terminal.local"],
    fs: {
      deny: [
        ".env",
        ".env.*",
        "*.{crt,pem}",
        "**/.git/**",
        "**/server/**",
        "**/scripts/**",
      ],
    },
  },
  build: { sourcemap: false },
});
