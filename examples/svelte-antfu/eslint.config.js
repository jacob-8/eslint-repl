// @ts-check
import antfu, { typescript } from '@antfu/eslint-config'
// import sveltePlugin from 'eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'
// @ts-expect-error - this package is not typed properly
import typescriptParser from '@typescript-eslint/parser'
import { defineFlatConfig } from 'eslint-define-config'

const svelte = defineFlatConfig({
  files: ['**/*.svelte'],
  // plugins: {
    // svelte: sveltePlugin,
  // },
  languageOptions: {
    parser: svelteParser,
    parserOptions: {
      parser: typescriptParser,
    },
  },
  // rules: {
    // ...sveltePlugin.configs.recommended?.rules,
  // },
})

const ignores = defineFlatConfig({
  ignores: [
    '**/.svelte-kit**',
  ],
})

export default antfu(
  {
    vue: false,
    typescript: false,
  },
  ...typescript({ componentExts: ['svelte'] }),
  ignores,
  svelte,
)

