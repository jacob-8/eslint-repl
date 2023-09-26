export async function loadExampleFiles(projectsRaw: Record<string, () => Promise<string>>, projectName: string) {
  const projectFilesPromises: Promise<{ key: string; value: string }>[] = []
  for (const [path, loadStringPromise] of Object.entries(projectsRaw)) {
    const [, trimmedPath] = path.split('examples/')
    const [project, ...rest] = trimmedPath.split('/')
    if (project !== projectName)
      continue

    const filepath = rest.join('/')
    projectFilesPromises.push(createKeyedPromise<string>(filepath, loadStringPromise()))
  }
  const resolvedFiles = await Promise.all(Object.values(projectFilesPromises))
  const projectFiles = resolvedFiles.reduce((acc, { key, value }) => {
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  return projectFiles
}

async function createKeyedPromise<T>(key: string, promise: Promise<T>): Promise<{
  key: string
  value: T
}> {
  const value = await promise
  return ({ key, value })
}

if (import.meta.vitest) {
  describe(loadExampleFiles, () => {
    const mockProjectsRaw = {
      '../../../examples/basic/index.js': () => Promise.resolve('content...'),
      '../../../examples/basic/package.json': () => Promise.resolve('content...'),
      '../../../examples/svelte/Foo.svelte': () => Promise.resolve('content...'),
      '../../../examples/svelte/package.json': () => Promise.resolve('content...'),
      '../../../examples/write-new-rule/README.md': () => Promise.resolve('content...'),
      '../../../examples/write-new-rule/build.config.ts': () => Promise.resolve('content...'),
      '../../../examples/write-new-rule/demo/to-lint.js': () => Promise.resolve('content...'),
      '../../../examples/write-new-rule/dist/index.cjs': () => Promise.resolve('content...'),
      '../../../examples/write-new-rule/src/rules/if-newline.ts': () => Promise.resolve('content...'),
      '../../../examples/write-new-rule/src/utils.ts': () => Promise.resolve('content...'),
    }
    test('loads just examples for the current project', async () => {
      expect(await loadExampleFiles(mockProjectsRaw, 'basic')).toEqual({
        'index.js': 'content...',
        'package.json': 'content...',
      })
      expect(await loadExampleFiles(mockProjectsRaw, 'svelte')).toEqual({
        'Foo.svelte': 'content...',
        'package.json': 'content...',
      })
      expect(await loadExampleFiles(mockProjectsRaw, 'write-new-rule')).toEqual({
        'README.md': 'content...',
        'build.config.ts': 'content...',
        'demo/to-lint.js': 'content...',
        'dist/index.cjs': 'content...',
        'src/rules/if-newline.ts': 'content...',
        'src/utils.ts': 'content...',
      })
    })
  })
}
