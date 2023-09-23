// @ts-check
import sveltePlugin from 'eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'

export default [
  {
    files: ['*.svelte'],
    plugins: {
      svelte: sveltePlugin,
    },
    languageOptions: {
      parser: svelteParser,
      // parserOptions: {
      //   parser: typescriptParser,
      // },
    },
    rules: {
      semi: ['error', 'never'],
      // https://sveltejs.github.io/eslint-plugin-svelte/rules/
      ...sveltePlugin.configs.base.overrides[0].rules,
      ...sveltePlugin.configs.recommended?.rules,
    },
  },
]
