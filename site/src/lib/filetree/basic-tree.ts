import type { FileSystemTree } from '@webcontainer/api'

export const basic: FileSystemTree = {
  'build.config.ts': {
    file: {
      contents: 'content...',
    },
  },
  'README.md': {
    file: {
      contents: 'content...',
    },
  },
  'demo': {
    directory: {
      'index.cjs': {
        file: {
          contents: 'content...',
        },
      },
      'to-lint.js': {
        file: {
          contents: 'content...',
        },
      },
    },
  },
  'src': {
    directory: {
      'rules': {
        directory: {
          'if-newline.ts': {
            file: {
              contents: 'content...',
            },
          },
        },
      },
      'utils.ts': {
        file: {
          contents: 'content...',
        },
      },
    },
  },
}
