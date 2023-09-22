<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { vs_dark_plus } from "./monaco-themes";
  import type { editor } from "monaco-editor/esm/vs/editor/editor.api.js";
  import { mapOfExtensionToLanguage } from "./languages";
  import { DEFAULT_MONACO_OPTIONS } from "./options";

  interface FileStub {
    name: string; // path
    basename: string; // filename
    contents: string;
    text: boolean;
  }

  export let stub: FileStub | null;
  export let options: editor.IStandaloneEditorConstructionOptions = {};

  let codeEditor: editor.IStandaloneCodeEditor;
  let container: HTMLDivElement;

  onMount(() => {
    let destroyed = false;

    import("./load-monaco-scripts").then(() => {
      if (destroyed) return;
      createEditor();
    });

    return () => {
      destroyed = true;
      codeEditor?.dispose();
    };
  });

  function createEditor() {
    window.monaco.editor.defineTheme("vs-dark-plus", vs_dark_plus);
    window.monaco.editor.setTheme("vs-dark-plus");
    codeEditor = window.monaco.editor.create(container, {
      ...DEFAULT_MONACO_OPTIONS,
      ...options,
      language: "handlebars",
      value: "",
    });
  }

  function languageOfStub(stub: FileStub) {
    const extension = stub.basename.split(".").pop() as string;
    return mapOfExtensionToLanguage[extension] || extension;
  }

  $: if (codeEditor && stub) {
    const model = codeEditor.getModel();
    if (model && stub.contents !== model.getValue()) {
      window.monaco.editor.setModelLanguage(model, languageOfStub(stub));
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

  // monaco.languages.typescript.typescriptDefaults.setCompilerOptions({ allowJs: true, esModuleInterop: true, })
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
