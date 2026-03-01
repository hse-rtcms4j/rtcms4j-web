import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import pkg from "./package.json";
import { viteEnvs } from 'vite-envs'

export default defineConfig({
    plugins: [
        react(),
        viteEnvs({declarationFile: ".env"})
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    define: {
        "import.meta.env.VITE_APP_VERSION": JSON.stringify(pkg.version),
    }
});
