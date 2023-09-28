// @ts-check
import antfu, { typescript } from '@antfu/eslint-config'
import { defineFlatConfig } from 'eslint-define-config'
import svelteParser from 'svelte-eslint-parser'

// @ts-expect-error - this package is not typed properly
import typescriptParser from '@typescript-eslint/parser'

const svelte = defineFlatConfig({
  files: ['**/*.svelte'],
  // plugins: {
  // svelte: sveltePlugin,
  // },
  languageOptions: {
    parser: svelteParser, // @ts-check
    parserOptions: {
      parser: typescriptParser,
    },
  },
  // rules: {
  // ...sveltePlugin.configs.recommended?.rules,
  // },
})

export default antfu(
  {
    vue: false,
    // typescript: false,
  },
  ...typescript({ componentExts: ['svelte', 'svx'] }),
  svelte,
  {
    ignores: [
      'examples/**',
      '**/.svelte-kit**',
    ],
  },
)
