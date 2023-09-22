import type { PageLoad } from './$types';

export const load = (async ({ params: { project: projectName } }) => {
    const projectsRaw = import.meta.glob([
        '../../../../examples/**',
      ], { as: 'raw', eager: true })
    return { projectsRaw, projectName };
}) satisfies PageLoad;