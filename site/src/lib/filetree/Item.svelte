<script lang="ts">
  import FileIcons from "./FileIcons.svelte";

  export let name = "";
  export let isDirectory = false;
  export let expanded = false;
  export let isSelected = false;
</script>

<button
  type="button"
  class="overflow-hidden w-full text-left bg-opacity-40 pb-2px"
  class:text-white={isSelected}
  style="white-space: nowrap;"
  on:click
  on:dblclick={() => {
    // if (can_remove) rename();
  }}
>
  {#if isDirectory}
    {#if expanded}
      <span class="i-material-symbols-folder-open align--2px" />
    {:else}
      <span class="i-material-symbols-folder align--2px" />
    {/if}
  {:else}
    <FileIcons basename={name} />
  {/if}
  {name}
</button>

<slot name="buttons" />

<div class="w-2" />
