<script lang="ts">
  import type { FileSystemTree } from "@webcontainer/api";
  import File from "./File.svelte";
  import Item from "./Item.svelte";

  export let tree: FileSystemTree;
  export let name: string;
  export let depth: number;
  export let expanded: boolean;

  function addFile() {
    alert("not implemented yet");
  }
</script>

{#if name !== "root"}
  <div
    class="flex hover:bg-gray-500/25 pl-[calc((var(--depth)*.6rem))]"
    style="--depth: {depth};"
  >
    <Item {name} {expanded} isDirectory on:click={() => (expanded = !expanded)}>
      <!-- <svelte:fragment slot="buttons">
        <button
          type="button"
          class="px-1 hover:bg-gray-500/25"
          aria-label="New File"
          on:click={addFile}><span class="i-codicon-new-file" /></button
        >
      </svelte:fragment> -->
    </Item>
  </div>
{/if}

{#if expanded}
  <ul>
    {#each Object.entries(tree) as [name, node]}
      {#if "directory" in node}
        <li>
          <svelte:self tree={node.directory} {name} depth={depth + 1} {expanded} />
        </li>
      {/if}
    {/each}
    {#each Object.entries(tree) as [name, node]}
      {#if "file" in node}
        <li>
          <File {name} depth={depth + 1} />
        </li>
      {/if}
    {/each}
  </ul>
{/if}
