import type { DirectoryNode, FileSystemTree } from '@webcontainer/api'

export function convertToFileSystemTree(files: Record<string, string>): FileSystemTree {
  const root: FileSystemTree = {}
  for (const [filepath, contents] of Object.entries(files)) {
    let currentNode = root
    const pathParts = filepath.split('/')
    const folders = pathParts.slice(0, -1)
    for (const folderName of folders) {
      if (!currentNode[folderName])
        currentNode[folderName] = { directory: {} }

      currentNode = (currentNode[folderName] as DirectoryNode).directory
    }
    const filename = pathParts.pop() as string
    currentNode[filename] = { file: { contents } }
  }
  return root
}

if (import.meta.vitest) {
  const files = {
    'README.md': 'content...',
    'build.config.ts': 'content...',
    'demo/to-lint.js': 'content...',
    'demo/index.cjs': 'content...',
    'src/rules/if-newline.ts': 'content...',
    'src/utils.ts': 'content...',
  }

  describe(convertToFileSystemTree, () => {
    test('basic', () => {
      expect(convertToFileSystemTree(files)).toMatchInlineSnapshot(`
        {
          "README.md": {
            "file": {
              "contents": "content...",
            },
          },
          "build.config.ts": {
            "file": {
              "contents": "content...",
            },
          },
          "demo": {
            "directory": {
              "index.cjs": {
                "file": {
                  "contents": "content...",
                },
              },
              "to-lint.js": {
                "file": {
                  "contents": "content...",
                },
              },
            },
          },
          "src": {
            "directory": {
              "rules": {
                "directory": {
                  "if-newline.ts": {
                    "file": {
                      "contents": "content...",
                    },
                  },
                },
              },
              "utils.ts": {
                "file": {
                  "contents": "content...",
                },
              },
            },
          },
        }
      `)
    })
  })
}
