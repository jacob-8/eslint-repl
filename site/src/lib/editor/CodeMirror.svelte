<script lang="ts">
  // https://github.dev/PuruVJ/neocodemirror/blob/main/packages/svelte/src/index.ts
  import { codemirror, withCodemirrorInstance, type NeoCodemirrorOptions } from "@neocodemirror/svelte";
  import { js_snippets, svelte_snippets } from "./snippets";
	import { createEventDispatcher } from 'svelte';
  import { mapOfExtensionToLanguage } from "./languages";
  import { vsCodeDarkPlus } from "./vs-code-dark-plus-theme";

  export let filename: string;
  export let content: string;
  $: lang = getLanguage(filename)

  function getLanguage(filename: string) {
    const extension = filename.split(".").pop() as string;
    return mapOfExtensionToLanguage[extension] || extension;
  }

  const cmInstance = withCodemirrorInstance()
  
  export function select(anchor: number, head: number = anchor) {
    // https://codemirror.net/examples/selection/
    $cmInstance.view?.dispatch({selection: {anchor, head}})
  }

  const langMap: NeoCodemirrorOptions['langMap'] = {
    javascript: () => import('@codemirror/lang-javascript').then((lang) => lang.javascript()),
		typescript: () => import('@codemirror/lang-javascript').then((lang) => lang.javascript({typescript: true})),
		svelte: () => import('@replit/codemirror-lang-svelte').then((lang) => lang.svelte()),
		html: () => import('@codemirror/lang-html').then((lang) => lang.html()),
		css: () => import('@codemirror/lang-css').then((lang) => lang.css()),
		json: () => import('@codemirror/lang-json').then((lang) => lang.json()),
		markdown: () => 
      Promise.all([
        import("@codemirror/lang-markdown"),
        import("@codemirror/language-data"),
      ]).then(([{ markdown }, { languages }]) => markdown({ codeLanguages: languages })),
	};

  const lint: NeoCodemirrorOptions['lint'] = () => {
    return [{
      from: 0,
      to: 10,
      severity: 'error',
      // markClass: 'cm-lint-mark-error',
      source: 'ESLint',
      message: 'This is a diagnostic message',
      // actions: [{
      //   name: 'Fix',
      //   apply: (view: EditorView, from: number, to: number) => void,
      // }]
    }]
  };

  const dispatch = createEventDispatcher<{ change: { filename: string, content: string } }>();
</script>

<div
  use:codemirror={{
    value: content,
    documentId: filename,
    setup: "basic",
    theme: vsCodeDarkPlus,
    lang,
    langMap,
    lint,
    lintOptions: {
      delay: 750, // default value
      // needsRefresh // can use when changes are made in other editor (eslint config or packages may have changed)
    },
    extensions: [js_snippets, svelte_snippets],
    instanceStore: cmInstance,
    // cursorPos: 0, will focus editor if set
  }}
  on:codemirror:textChange={({ detail: updatedCode }) => {
    dispatch("change", { filename, content: updatedCode });
  }}
/>
