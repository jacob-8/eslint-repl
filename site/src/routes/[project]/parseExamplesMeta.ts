import type { ExampleMeta } from '$lib/example.interface'

export function parseExamplesMeta(examplesMeta: Record<string, Record<'meta', ExampleMeta>>, projectName: string): { projects: string[]; meta: ExampleMeta } {
  const projects: string[] = []
  let meta: ExampleMeta = {}
  for (const key in examplesMeta) {
    const [, trimmedPath] = key.split('examples/')
    const [project] = trimmedPath.split('/')
    projects.push(project)
    if (project === projectName)
      meta = examplesMeta[key].meta
  }

  return { projects, meta }
}

if (import.meta.vitest) {
  test(parseExamplesMeta, () => {
    const mockExamplesMetaModules: Record<string, Record<'meta', ExampleMeta>> = {
      '../../../examples/basic/example-meta.ts': { meta: { lintFocus: 'foo', configFocus: 'bar' } },
      '../../../examples/complex/example-meta.ts': { meta: { lintFocus: 'hello', configFocus: 'world' } },
    }
    expect(parseExamplesMeta(mockExamplesMetaModules, 'basic')).toEqual({
      projects: ['basic', 'complex'],
      meta: { lintFocus: 'foo', configFocus: 'bar' },
    })
  })
}
