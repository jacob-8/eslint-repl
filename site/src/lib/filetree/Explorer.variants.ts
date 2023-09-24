import type { Variants } from 'kitbook'
import type Component from './Explorer.svelte'
import { basic } from './basic-tree'

export const variants: Variants<Component> = [
  {
    name: 'Desktop',
    description: 'Describe this variant',
    props: {
      tree: basic,
      configFocus: 'build.config.ts',
      lintFocus: 'README.md',
    },
  },
]
