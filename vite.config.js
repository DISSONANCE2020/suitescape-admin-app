import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: ["resources/css/app.css", "resources/js/app.jsx"],
            refresh: true,
        }),
    ],
    server: {
        proxy: {
            "/app": "http://127.0.0.1:8000", // Proxy API requests to Laravel server
        },
    },
});
