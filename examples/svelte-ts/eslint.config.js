// @ts-check
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'
import sveltePlugin from 'eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'
// @ts-expect-error - this package is not typed properly
import typescriptParser from '@typescript-eslint/parser'
import { defineFlatConfig } from 'eslint-define-config'

const typescript = defineFlatConfig({
  files: ['**/*.ts', '**/*.js', '**/*.svelte'],
  plugins: {
    '@typescript-eslint': tsEslintPlugin,
  },
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      extraFileExtensions: ['.svelte'],
    },
  },
  rules: {
    ...tsEslintPlugin.configs.recommended?.rules,
    ...tsEslintPlugin.configs.stylistic?.rules,
  }
})

const svelte = defineFlatConfig({
  // @ts-ignore - sveltePlugin throws typing errors in conjunction with defineFlatConfig
  files: ['**/*.svelte'],
  plugins: {
    svelte: sveltePlugin,
  },
  languageOptions: {
    parser: svelteParser,
    parserOptions: {
      parser: typescriptParser,
    },
  },
  rules: {
    'semi': ['error', 'never'],
    ...sveltePlugin.configs.base.overrides[0].rules,
    ...sveltePlugin.configs.recommended?.rules,
    'svelte/no-at-html-tags': ['warn'],
  },
})

const ignores = defineFlatConfig({
  ignores: [
    '**/.svelte-kit**',
  ],
})

export default [
  typescript,
  svelte,
  ignores,
]
