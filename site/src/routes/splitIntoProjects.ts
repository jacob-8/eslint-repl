export function splitIntoProjects(rawProjects: Record<string, string>) {
  const splitProjects: Record<string, Record<string, string>> = {};
  for (const key in rawProjects) {
    const [,trimmedPath] = key.split("../../../examples/");
    const [project, ...rest] = trimmedPath.split("/")
    if (!splitProjects[project]) {
      splitProjects[project] = {};
    }
    const filepath = rest.join('/')
    splitProjects[project][filepath] = rawProjects[key];
  }
  return splitProjects;
}

if (import.meta.vitest) {
  const rawProjects = {
    "../../../examples/basic/index.js": "content...",
    "../../../examples/basic/package.json": "content...",
    "../../../examples/svelte/Foo.svelte": "content...",
    "../../../examples/svelte/package.json": "content...",
    "../../../examples/write-new-rule/README.md": "content...",
    "../../../examples/write-new-rule/build.config.ts": "content...",
    "../../../examples/write-new-rule/demo/to-lint.js": "content...",
    "../../../examples/write-new-rule/dist/index.cjs": "content...",
    "../../../examples/write-new-rule/src/rules/if-newline.ts": "content...",
    "../../../examples/write-new-rule/src/utils.ts": "content...",
  };

  describe(splitIntoProjects, () => {
    test('content...', () => {
      expect(splitIntoProjects(rawProjects)).toMatchInlineSnapshot(`
        {
          "basic": {
            "index.js": "content...",
            "package.json": "content...",
          },
          "svelte": {
            "Foo.svelte": "content...",
            "package.json": "content...",
          },
          "write-new-rule": {
            "README.md": "content...",
            "build.config.ts": "content...",
            "demo/to-lint.js": "content...",
            "dist/index.cjs": "content...",
            "src/rules/if-newline.ts": "content...",
            "src/utils.ts": "content...",
          },
        }
      `);
    });
  });
}