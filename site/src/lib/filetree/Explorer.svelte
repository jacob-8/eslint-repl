<script lang="ts">
  import type { FileSystemTree } from "@webcontainer/api";
  import Folder from "./Folder.svelte";

  export let tree: FileSystemTree
  export let configFocus: string;
  export let lintFocus: string;
</script>

<div
  class="h-full bg-[--scrollbar-border-color] overflow-y-auto overflow-x-hidden text-white/70 pt-1"
  style="--scrollbar-border-color: hsl(0, 0%, 9%);"
>
   <Folder tree={tree} path="" depth={0} expanded bind:lintFocus bind:configFocus />
</div>
