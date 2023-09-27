import type { LayoutLoad } from './$types'
import type { ExampleMeta } from '$lib/example.interface'

export const load = (() => {
  return {
    examplesMeta: getExamplesMeta(),
  }
}) satisfies LayoutLoad

function getExamplesMeta() {
  const examplesMetaModules = import.meta.glob(['../../../examples/*/example-meta.ts'], { eager: true }) as Record<string, Record<'meta', ExampleMeta>>
  return examplesMetaModules
}
