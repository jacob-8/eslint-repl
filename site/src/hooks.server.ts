/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%unocss-svelte-scoped.global%', 'unocss_svelte_scoped_global_styles'),
  })

  // Add headers to allow cross-origin requests for webcontainer
  response.headers.set('cross-origin-opener-policy', 'same-origin');
  response.headers.set('cross-origin-embedder-policy', 'require-corp');
  response.headers.set('cross-origin-resource-policy', 'cross-origin');

  return response
}
