import { defineConfig, splitVendorChunkPlugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import BuildInfo from 'vite-plugin-info';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { viteInlineLinkSvg } from "./vite-plugin-inlineLinkSvg";
import packageLockJson from "../package-lock.json";

export default defineConfig(({
    command,
}) => ({
    optimizeDeps: {
        exclude: [
            'three'
        ]
    },
    resolve: {
        alias: {
            ...(command === "build" && {
                "three": `https://unpkg.com/three@${packageLockJson.packages["node_modules/three"].version}/build/three.module.js`,
            }),
        }
    },
    build: {
        // minify: false,
        rollupOptions: {
            output: {
                // manualChunks(id) {
                //     const match = id.match(/node_modules\/(.*?)\//);
                //     if (!match) { return; }
                //     const name = match[1];
                //     if (name === "three") { return name; }
                // }
            }
        }
    },
    plugins: [
        react({
            babel: {
                plugins: ["@emotion/babel-plugin"],
            },
        }),
        BuildInfo(),
        // VitePWA({
        //     injectRegister: 'inline',
        //     workbox: {
        //         globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        //     },
        //     manifest: {
        //         short_name: "polymer-computing",
        //         name: "polymer-computing",
        //         start_url: "./?utm_source=web_app_manifest",
        //         theme_color: "#f4f1ff",
        //         background_color: "#f4f1ff",
        //         display: "standalone",
        //         icons: [
        //             {
        //                 src: './android-chrome-192x192.png',
        //                 sizes: '192x192',
        //                 type: 'image/png'
        //             },
        //             {
        //                 src: './android-chrome-512x512.png',
        //                 sizes: '512x512',
        //                 type: 'image/png'
        //             },
        //             {
        //                 src: './android-chrome-512x512.png',
        //                 sizes: '512x512',
        //                 type: 'image/png',
        //                 purpose: 'any'
        //             },
        //             {
        //                 src: './android-chrome-512x512-maskable.png',
        //                 sizes: '512x512',
        //                 type: 'image/png',
        //                 purpose: 'maskable'
        //             },
        //         ],
        //     }
        // }),
        viteInlineLinkSvg(),
        viteSingleFile(),
    ],
    server: {
        port: 6742,
    },
    base: "./",
}));