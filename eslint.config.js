// @ts-check
import antfu, { typescript } from '@antfu/eslint-config'
import { svelte } from './lint/svelte.js'

export default antfu(
  {
    vue: false,
    // typescript: false,
  },
  ...typescript({
    componentExts: ['svelte', 'svx'],
    overrides: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-alert': 'off',
    },
  }),
  // @ts-ignore
  svelte,
  {
    ignores: [
      'examples/**',
      '**/.svelte-kit**',
    ],
  },
)
