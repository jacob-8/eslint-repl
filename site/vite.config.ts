import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import UnoCSS from '@unocss/svelte-scoped/vite'
import { kitbook } from 'kitbook/plugins/vite'

export default defineConfig({
  plugins: [
    UnoCSS({
      injectReset: '@unocss/reset/tailwind.css',
    }),
    kitbook({
      title: 'ESLint Workbench Kitbook',
      description: 'Develop and test ESLint rules in the browser',
      viewports: [
        { width: 320, height: 640 },
      ],
      expandTree: true,
    }),
    sveltekit(),
  ],
  // server: {
  // headers: {
  // 'Cross-Origin-Embedder-Policy': 'require-corp',
  // 'Cross-Origin-Opener-Policy': 'same-origin',
  // 'Cross-Origin-Resource-Policy': 'cross-origin',
  // },
  // },
})

// import type { Plugin } from 'vite';
// function crossOriginPreviewPlugin(): Plugin {
//   return {
//     name: 'cross-origin-isolation-for-preview',
//     configurePreviewServer: (server) => {
//       server.middlewares.use((_, res, next) => {
//         res.setHeader('cross-origin-opener-policy', 'same-origin');
//         res.setHeader('cross-origin-embedder-policy', 'require-corp');
//         res.setHeader('cross-origin-resource-policy', 'cross-origin');
//         next();
//       });
//     }
//   };
// }
