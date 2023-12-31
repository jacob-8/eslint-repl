# ESLint REPL

[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)

Learn how to use ESLint, and even write a few rules of your own with live feedback and testing.

## CodeMirror

- https://github.dev/sveltejs/learn.svelte.dev
- https://www.sveltelab.dev/
- https://github.com/sveltejs/svelte/tree/master/sites/svelte.dev/src/routes/(authed)/repl
- https://github.dev/touchifyapp/svelte-codemirror-editor & https://touchifyapp.github.io/svelte-codemirror-editor
- https://github.com/replit/codemirror-lang-svelte
- https://codemirror.net/docs/ref/#lint

### TS autocomplete

- https://discuss.codemirror.net/t/codemirror-6-and-typescript-lsp/3398/28
- https://github.com/danilowoz/sandpack-tsserver/pull/5
- https://github.com/codesandbox/sandpack/discussions/237
- https://github.dev/prisma/text-editors

## ESLint Playgrounds

- https://eslint.org/play/
- https://typescript-eslint.io/play
- https://sveltejs.github.io/eslint-plugin-svelte/playground/
- https://ota-meshi.github.io/eslint-plugin-vue-demo/

## Other resources

- https://webcontainers.io/api
- [ESLint CLI](https://eslint.org/docs/latest/use/command-line-interface#-o---output-file)

## Roadmap

- make save clearer, asynchronous
  - show hash name in content sidebar
- Add fix result, [Merge View](https://codemirror.net/try/?example=Merge%20View)
- add basic tutorial
- Add AST explanation: https://www.mariokandut.com/how-to-write-custom-eslint-rule/
- allow setting name
- Inspect fix action positioning on other lines
- feed examples via server.ts file, use HMR when editing
- resize remembering of panels + hotkeys
- dark mode