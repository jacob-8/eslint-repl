import type { PageLoad } from './$types';

export const load = (async () => {
    const projectsRaw = import.meta.glob([
        '../../../examples/**',
      ], { as: 'raw', eager: true })
    return { projectsRaw };
}) satisfies PageLoad;