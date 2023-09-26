Here is a minimal setup demonstrating how to write a new ESLint. You'll notice a rule in `src/rules/if-newline.ts`. This rule is exported from `src/index.ts` and the REPL is automatically stubbing your src directory out to the dist directory which is why you can see `./dist/index.mjs` is able to be imported into your `eslint.config.js` file.

You will also find a test here, which you can run in the terminal with `npm test`. Make changes and watch your tests update accordingly as is expected with Vitest.

Initial example from https://github.com/antfu/eslint-plugin-antfu - look at that repo for more tips.

Other sources for info on writing rules:
- https://eslint.org/docs/latest/contribute/tests
- https://eslint.org/docs/latest/extend/custom-rules
- https://typescript-eslint.io/packages/rule-tester/
- https://github.dev/veritem/eslint-plugin-vitest
- https://medium.com/inato/using-typescript-to-build-custom-eslint-rules-faster-53ad1c9dee2b