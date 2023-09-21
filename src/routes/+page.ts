import type { PageLoad } from './$types';

export const load = (async () => {
    const projectFiles = import.meta.glob([
        '/example-project/**',
        '/!example-project/node_modules/**',
        '/!example-project/.vscode/**',
      ], { as: 'raw', eager: true })
    return { projectFiles };
}) satisfies PageLoad;