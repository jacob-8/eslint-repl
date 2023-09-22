import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import UnoCSS from '@unocss/svelte-scoped/vite';
// import type { Plugin } from 'vite';

export default defineConfig({
  plugins: [
    UnoCSS({
      injectReset: '@unocss/reset/tailwind.css',
    }),
    // crossOriginPreviewPlugin(),
    sveltekit(),
  ],
  server: {
    headers: {
      // 'Cross-Origin-Embedder-Policy': 'require-corp',
      // 'Cross-Origin-Opener-Policy': 'same-origin',
      // 'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  },
});

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
