import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    name: 'site:unit',
    globals: true,
    includeSource: ['./src/**/*.ts'],
  },
})
