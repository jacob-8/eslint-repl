import type { PageLoad } from './$types'
import type { ExampleMeta } from '$lib/example.interface'

interface MetaModule { meta: ExampleMeta }

export const load = (async ({ params: { project: projectName } }) => {
  const projectsRaw = import.meta.glob(['../../../../examples/**', '!**/example-meta.ts'], { as: 'raw', eager: true })
  const projectsMeta = import.meta.glob(['../../../../examples/**/example-meta.ts']) as Record<string, () => Promise<MetaModule>>
  const lintModulesRaw = import.meta.glob(['../../../../lint-to-load-in/*.js'], { as: 'raw', eager: true })

  let meta: ExampleMeta = {}
  const metaPromise = projectsMeta[`../../../../examples/${projectName}/example-meta.ts`]
  if (metaPromise)
    ({ meta } = await metaPromise())

  return { projectsRaw, meta, projectName, lintModulesRaw }
}) satisfies PageLoad
