import type { PageLoad } from './$types';

export const load = (async () => {
    const projectFiles = import.meta.glob([
        '/examples/svelte/**',
      ], { as: 'raw', eager: true })
    return { projectFiles };
}) satisfies PageLoad;