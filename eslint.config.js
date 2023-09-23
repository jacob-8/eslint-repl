import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: false,
  },
  {
    ignores: [
      'examples/basic/index.js',
      'examples/write-new-rule/demo/**',
      '**/.svelte-kit**',
    ],
  },
)
