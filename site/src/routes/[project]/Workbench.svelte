<script lang="ts">
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import Console from "./Console.svelte";
  import { convertToFileSystemTree } from "$lib/filetree/convertToFileSystemTree";
  import CodeMirror from "$lib/editor/CodeMirror.svelte";
  import { initProjectInWebContainer, projectStatus, shellProcess, write } from "$lib/webcontainer";
  import { lint } from "$lib/lint";
  import Explorer from "$lib/filetree/Explorer.svelte";
  import { writable } from "svelte/store";

  export let projectFiles: Record<string, string>;
  export let configFocus: string;
  export let lintFocus: string;
  let files = writable<Record<string, string>>({});
  
  $: setupProject(projectFiles)
  function setupProject(_files: Record<string, string>) {
    $files = _files;
    const tree = convertToFileSystemTree(_files);
    initProjectInWebContainer(tree);
  }
</script>

<SplitPane pos={30} min={0}>
  <section class="h-full border-r border-truegray-700 flex flex-col" slot="a">
    <SplitPane type="vertical" pos={33} min={0}>
      <section class="h-full border-b border-truegray-700" slot="a">
        <Explorer tree={convertToFileSystemTree($files)} bind:lintFocus bind:configFocus />
      </section>
      <section class="h-full bg-black" slot="b">
        <CodeMirror
          filename={configFocus}
          content={$files[configFocus]}
          on:change={async ({ detail: { filename, content } }) => {
            await write(filename, content);
            $files[configFocus] = content;
            console.log({ filename, content });
          }}
        />
      </section>
    </SplitPane>
  </section>
  <section class="h-full" slot="b">
    <SplitPane type="vertical" pos={75} min={0}>
      <section class="h-full bg-black border-b border-truegray-700" slot="a">
        <CodeMirror
          filename={lintFocus}
          content={$files[lintFocus]}
          lint={lint(lintFocus)}
          on:change={async ({ detail: { filename, content } }) => {
            await write(filename, content);
            $files[lintFocus] = content;
            console.log({ filename, content });
          }}
        />
      </section>
      <section class="h-full relative" slot="b">
        <Console shellProcess={$shellProcess} />
        {#if $projectStatus !== "ready"}
          <div
            class="absolute z-1 right-0 top-0 font-semibold text-white bg-black p-2"
          >
            Status: {$projectStatus}
          </div>
        {/if}
      </section>
    </SplitPane>
  </section>
</SplitPane>
