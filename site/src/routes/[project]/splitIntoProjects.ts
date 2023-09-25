export function splitIntoProjects(projectsRaw: Record<string, string>, lintModulesRaw: Record<string, string>) {
  const splitProjects: Record<string, Record<string, string>> = {}
  for (const key in projectsRaw) {
    const [,trimmedPath] = key.split('examples/')
    const [project, ...rest] = trimmedPath.split('/')
    if (!splitProjects[project])
      splitProjects[project] = {}

    const filepath = rest.join('/')
    splitProjects[project][filepath] = projectsRaw[key]
  }

  for (const key in lintModulesRaw) {
    const [,filepath] = key.split('lint-to-load-in/')
    for (const project in splitProjects)
      splitProjects[project][filepath] = lintModulesRaw[key]
  }
  return splitProjects
}

if (import.meta.vitest) {
  const projectsRaw = {
    '../../../../examples/basic/index.js': 'content...',
    '../../../../examples/basic/package.json': 'content...',
    '../../../../examples/svelte/Foo.svelte': 'content...',
    '../../../../examples/svelte/package.json': 'content...',
    '../../../../examples/write-new-rule/README.md': 'content...',
    '../../../../examples/write-new-rule/build.config.ts': 'content...',
    '../../../../examples/write-new-rule/demo/to-lint.js': 'content...',
    '../../../../examples/write-new-rule/dist/index.cjs': 'content...',
    '../../../../examples/write-new-rule/src/rules/if-newline.ts': 'content...',
    '../../../../examples/write-new-rule/src/utils.ts': 'content...',
  }

  const lintModulesRaw = {
    '../../../../lint-to-load-in/get-config.js': 'content...',
    '../../../../lint-to-load-in/run-lint.js': 'content...',
  }

  describe(splitIntoProjects, () => {
    test('basic', () => {
      expect(splitIntoProjects(projectsRaw, lintModulesRaw)).toEqual({
        'basic': {
          'index.js': 'content...',
          'package.json': 'content...',
          'get-config.js': 'content...',
          'run-lint.js': 'content...',
        },
        'svelte': {
          'Foo.svelte': 'content...',
          'package.json': 'content...',
          'get-config.js': 'content...',
          'run-lint.js': 'content...',
        },
        'write-new-rule': {
          'README.md': 'content...',
          'build.config.ts': 'content...',
          'demo/to-lint.js': 'content...',
          'dist/index.cjs': 'content...',
          'src/rules/if-newline.ts': 'content...',
          'src/utils.ts': 'content...',
          'get-config.js': 'content...',
          'run-lint.js': 'content...',
        },
      })
    })
  })
}
