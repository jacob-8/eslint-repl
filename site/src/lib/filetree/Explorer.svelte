<script lang="ts">
  import type { FileSystemTree } from "@webcontainer/api";
  import Folder from "./Folder.svelte";

  export let tree: FileSystemTree
</script>

<div
  class="h-full bg-[--scrollbar-border-color] overflow-y-auto overflow-x-hidden text-white/70 text-sm pt-1"
  style="--scrollbar-border-color: hsl(0, 0%, 9%);"
>
   <Folder tree={tree} name="root" depth={0} expanded />
</div>
