<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { vs_dark_plus } from "./monaco-themes.js";
  import type { editor } from "monaco-editor/esm/vs/editor/editor.api.js";
  import { mapOfExtensionToLanguage } from "./languages";
  import { DEFAULT_MONACO_OPTIONS } from "./options";
  import { dev } from "$app/environment";

  interface FileStub {
    name: string; // path
    basename: string; // filename
    contents: string;
    text: boolean;
  }

  export let stub: FileStub | null;
  export let options: editor.IStandaloneEditorConstructionOptions = {};

  let monaco: typeof import("monaco-editor");
  let codeEditor: editor.IStandaloneCodeEditor;
  let container: HTMLDivElement;

  onMount(() => {
    let destroyed = false;

    if (dev && !/chrome/i.test(navigator.userAgent)) {
      // eslint-disable-next-line svelte/no-dom-manipulating
      container.innerHTML =
        '<p style="text-align: center; width: 20em; max-width: calc(100% - 4rem)">The code editor requires Chrome during development, as it uses module workers</p>';
      return;
    }

    import("./load-monaco.js").then(({ monaco: _monaco }) => {
      monaco = _monaco;
      if (destroyed) return;
      codeEditor = createEditor(monaco);
    });

    return () => {
      destroyed = true;
      codeEditor?.dispose();
    };
  });

  function createEditor(monaco: typeof import("monaco-editor")) {
    monaco.editor.defineTheme("vs-dark-plus", vs_dark_plus);
    monaco.editor.setTheme("vs-dark-plus");
    // if adding textmate grammar using https://github.com/zikaari/monaco-editor-textmate https://github.com/ChristopherHButler/vscode-themes-in-monaco/blob/d2ad1847c765bf03ad22853132e8c96c6758c680/src/components/CodeEditor.js#L170 - then the vs-dark-plus theme will have additional effect

    return monaco.editor.create(container, {
      ...DEFAULT_MONACO_OPTIONS,
      ...options,
      language: "handlebars",
      value: "",
    });
  }

  $: if (codeEditor && stub) {
    const model = codeEditor.getModel();
    if (model && stub.contents !== model.getValue()) {
      monaco.editor.setModelLanguage(model, languageOfStub(stub));
      model.applyEdits([
        { range: model.getFullModelRange(), text: stub.contents },
      ]);
    }
  }

  const dispatch = createEventDispatcher<{ change: FileStub }>();
  function emitChange() {
    if (!stub) return;
    dispatch("change", {
      ...stub,
      contents: codeEditor.getValue(),
    });
  }

  function languageOfStub(stub: FileStub) {
    const extension = stub.basename.split(".").pop() as string;
    return mapOfExtensionToLanguage[extension] || extension;
  }
</script>

<div class="w-full h-full relative overflow-hidden">
  <div
    class="absolute inset-0 w-full h-full"
    on:keyup={emitChange}
    bind:this={container}
  />
</div>

<style>
  div :global(.core-guide-indent.vertical) {
    display: none;
  }

  div :global(.decorationsOverviewRuler) {
    display: none !important;
  }
</style>
