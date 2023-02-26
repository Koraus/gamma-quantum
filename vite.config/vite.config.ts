import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import BuildInfo from 'vite-plugin-info';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { viteInlineLinkSvg } from "./vite-plugin-inlineLinkSvg";
import packageLockJson from "../package-lock.json";
import { createHtmlPlugin } from 'vite-plugin-html';

const importMap = {
    "three": `https://unpkg.com/three@${packageLockJson.packages["node_modules/three"].version}/build/three.module.js`,
};

export default defineConfig(({
    command,
}) => ({
    resolve: {
        alias: {
            ...(command === "build" && importMap),
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
        createHtmlPlugin({
            // minify: false,
            inject: {
                tags: [
                    ...(command !== "build" ? [] :
                        Object.values(importMap).map(href => ({
                            injectTo: "head",
                            tag: "link",
                            attrs: { rel: "modulepreload", crossorigin: "", href },
                        } as const))
                    ),
                ],
            }
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