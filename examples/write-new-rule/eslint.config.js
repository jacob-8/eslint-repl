import myRules from './dist/index.mjs'

export default [
  {
    files: ['demo/to-lint.js'],
    plugins: {
      foo: myRules,
    },
    rules: {
      'foo/if-newline': 'error'
    },
  },
]
