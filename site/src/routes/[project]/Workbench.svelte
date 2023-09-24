<script lang="ts">
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import Console from "./Console.svelte";
  import { convertToFileSystemTree } from "$lib/filetree/convertToFileSystemTree";
  import CodeMirror from "$lib/editor/CodeMirror.svelte";
  import { initProjectInWebContainer, projectStatus, shellProcess, write } from "$lib/webcontainer";
  import { lint } from "$lib/lint";
  import Explorer from "$lib/filetree/Explorer.svelte";
  import type { FileSystemTree } from "@webcontainer/api";
  import { writable } from "svelte/store";

  export let projectFiles: Record<string, string>;
  export let configFocus: string;
  export let lintFocus: string;
  let tree = writable<FileSystemTree>();
  
  $: setupProject(projectFiles)
  function setupProject(files: Record<string, string>) {
    $tree = convertToFileSystemTree(files);
    initProjectInWebContainer($tree);
  }

  $: editingFilename = $tree["index.js"]
    ? "index.js"
    : $tree["Foo.svelte"]
    ? "Foo.svelte"
    : "if-newline.ts";

</script>

<SplitPane pos={30} min={0}>
  <section class="h-full border-r border-truegray-700 flex flex-col" slot="a">
    <SplitPane type="vertical" pos={33} min={0}>
      <section class="h-full border-b border-truegray-700" slot="a">
        <Explorer tree={$tree} />
      </section>
      <section class="h-full bg-black" slot="b">
        <CodeMirror
          filename={configFocus}
          content={$tree[configFocus].file.contents}
          on:change={({ detail: { filename, content } }) => {
            // console.log({ filename, content });
          }}
        />
      </section>
    </SplitPane>
  </section>
  <section class="h-full" slot="b">
    <SplitPane type="vertical" pos={75} min={0}>
      <section class="h-full bg-black border-b border-truegray-700" slot="a">
        {#if editingFilename === "if-newline.ts"}
          <CodeMirror
            filename={editingFilename}
            content={$tree.src.directory.rules.directory[editingFilename].file
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
            content={$tree[editingFilename].file.contents}
            lint={lint(editingFilename)}
            on:change={({ detail: { filename, content } }) => {
              // console.log({ filename, content });
            }}
          />
        {/if}
      </section>
      <section class="h-full relative" slot="b">
        <Console shellProcess={$shellProcess} />
        {#if $projectStatus !== "ready"}
           
        <div class="absolute z-1 right-0 top-0 font-semibold text-white bg-black p-2">
          Status: {$projectStatus}
        </div>
        {/if}
      </section>
    </SplitPane>
  </section>
</SplitPane>
