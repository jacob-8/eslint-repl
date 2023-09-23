<script lang="ts">
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import { onMount } from "svelte";
  import Console from "./Console.svelte";
  import { convertToFileSystemTree } from "./convertToFileSystemTree";
  import CodeMirror from "$lib/editor/CodeMirror.svelte";
  import { runLint } from "$lib/commands";
  import { mountProject, shellProcess, write } from "$lib/webcontainer";
  import type { NeoCodemirrorOptions } from "@neocodemirror/svelte";

  export let files: Record<string, string>;

  $: tree = convertToFileSystemTree(files);
  $: editingFilename = tree["index.js"]
    ? "index.js"
    : tree["Foo.svelte"]
    ? "Foo.svelte"
    : "if-newline.ts";

  $: mountProject(tree);

  async function waitForShell() {
    console.log("checking for shell");

    if (!$shellProcess) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return waitForShell();
    }
  }

  const lint: NeoCodemirrorOptions["lint"] = async () => {
    await waitForShell();
    const results = await runLint(editingFilename);
    console.log({ results });
    return [
      {
        from: 0,
        to: 10,
        severity: "error",
        markClass: "cm-lint-mark-error",
        source: "ESLint",
        message: "This is a diagnostic message",
        // actions: [{
        //   name: 'Fix',
        //   apply: (view: EditorView, from: number, to: number) => void,
        // }]
      },
    ];
  };
</script>

<SplitPane pos={30} min={0}>
  <section class="h-full border-r border-gray-600 flex flex-col" slot="a">
    <SplitPane type="vertical" pos={33} min={0}>
      <section
        class="h-full bg-gray-800 text-white border-b border-gray-600 p-3 overflow-x-auto"
        slot="a"
      >
        <pre>{JSON.stringify(files, null, 2)}</pre>
      </section>
      <section class="h-full bg-black" slot="b">
        <CodeMirror
          filename="eslint.config.js"
          content={tree["eslint.config.js"].file.contents}
          on:change={({ detail: { filename, content } }) => {
            // console.log({ filename, content });
          }}
        />
      </section>
    </SplitPane>
  </section>
  <section class="h-full" slot="b">
    <SplitPane type="vertical" pos={75} min={0}>
      <section class="h-full bg-black border-b border-gray-600" slot="a">
        {#if editingFilename === "if-newline.ts"}
          <CodeMirror
            filename={editingFilename}
            content={tree.src.directory.rules.directory[editingFilename].file
              .contents}
            {lint}
            on:change={async ({ detail: { filename, content } }) => {
              // console.log({ filename, content });
              await write("src/rules/if-newline.ts", content);
            }}
          />
        {:else}
          <CodeMirror
            filename={editingFilename}
            content={tree[editingFilename].file.contents}
            {lint}
            on:change={({ detail: { filename, content } }) => {
              // console.log({ filename, content });
            }}
          />
        {/if}
      </section>
      <section class="h-full" slot="b">
        <Console shellProcess={$shellProcess} />
      </section>
    </SplitPane>
  </section>
</SplitPane>
