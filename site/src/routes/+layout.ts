import type { LayoutLoad } from './$types'
import type { ExampleMeta } from '$lib/example.interface'

export const load = (() => {
  return {
    lintModules: getLintModules(),
    examplesMeta: getExamplesMeta(),
  }
}) satisfies LayoutLoad

function getLintModules() {
  const lintModulesRaw = import.meta.glob(['../../../lint-to-load-in/*.js'], { as: 'raw', eager: true })
  const lintModules: Record<string, string> = {}
  for (const key in lintModulesRaw) {
    const [,filepath] = key.split('lint-to-load-in/')
    lintModules[filepath] = lintModulesRaw[key]
  }
  return lintModules
}

function getExamplesMeta() {
  const examplesMetaModules = import.meta.glob(['../../../examples/*/example-meta.ts'], { eager: true }) as Record<string, Record<'meta', ExampleMeta>>
  return examplesMetaModules
}
