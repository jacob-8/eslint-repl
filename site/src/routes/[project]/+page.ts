import type { PageLoad } from './$types'
import type { ExampleMeta } from '$lib/example.interface'

interface MetaModule { meta: ExampleMeta }

export const load = (async ({ params: { project: projectName } }) => {
  const projectsRaw = import.meta.glob(['../../../../examples/**', '!**/example-meta.ts'], { as: 'raw', eager: true })
  const projectsMeta = import.meta.glob(['../../../../examples/**/example-meta.ts']) as Record<string, () => Promise<MetaModule>>
  return { projectsRaw, projectsMeta, projectName }
}) satisfies PageLoad
