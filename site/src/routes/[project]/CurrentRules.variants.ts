import type { Variants } from 'kitbook'
import type Component from './CurrentRules.svelte'

export const variants: Variants<Component> = [
  {
    viewports: [
      { height: 700, width: 500 },
      { height: 400, width: 400 },
    ],
    props: {
      filename: 'src/index.js',
      currentViolationRuleIds: ['no-undef', 'no-console'],
      rulesMeta: {
        'no-undef': {
          docs: {
            url: 'https://eslint.org/docs/rules/no-undef',
            description: 'disallow the use of undeclared variables unless mentioned in /*global */ comments',
          },
          fixable: 'code',
        },
        'no-console': {
          docs: {
            url: 'https://eslint.org/docs/rules/no-console',
            description: 'disallow the use of console',
          },
        },
        'no-unused-vars': {
          docs: {
            url: 'https://eslint.org/docs/rules/no-unused-vars',
            description: 'disallow unused variables',
          },
        },
      },
    },
  },
  {
    props: {
      currentViolationRuleIds: ['no-undef', 'no-console'],
      filename: 'src/index.js',
      rulesMeta: {
        'no-unused-vars': {
          docs: {
            url: 'https://eslint.org/docs/rules/no-unused-vars',
            description: 'disallow unused variables',
          },
        },
      },
    },
  },
]
