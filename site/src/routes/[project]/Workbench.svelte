<script lang="ts">
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import Console from "./Console.svelte";
  import { convertToFileSystemTree } from "./convertToFileSystemTree";
  import CodeMirror from "$lib/editor/CodeMirror.svelte";
  import { mountProject, shellProcess, write } from "$lib/webcontainer";
  import { lint } from "$lib/lint";
  import './scrollbar.css'

  export let files: Record<string, string>;

  $: tree = convertToFileSystemTree(files);
  $: editingFilename = tree["index.js"]
    ? "index.js"
    : tree["Foo.svelte"]
    ? "Foo.svelte"
    : "if-newline.ts";

  $: mountProject(tree);
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
            lint={lint(editingFilename)}
            on:change={async ({ detail: { filename, content } }) => {
              // console.log({ filename, content });
              await write("src/rules/if-newline.ts", content);
            }}
          />
        {:else}
          <CodeMirror
            filename={editingFilename}
            content={tree[editingFilename].file.contents}
            lint={lint(editingFilename)}
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
