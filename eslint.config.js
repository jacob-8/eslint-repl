import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: false,
    // typescript: false,
  },
  // ...typescript({ componentExts: ['svelte', 'svx'] }),
  {
    ignores: [
      'examples/**',
      '**/.svelte-kit**',
    ],
  },
)
