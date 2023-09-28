<script lang="ts">
  import FileIcons from './FileIcons.svelte'

  export let path = ''
  export let isDirectory = false
  export let expanded = false
  export let isSelected = false

  $: name = path.split('/').pop() || ''
</script>

<button
  type="button"
  class="overflow-hidden w-full text-left bg-opacity-40 pb-2px"
  class:text-white={isSelected}
  style="white-space: nowrap;"
  on:click
  on:dblclick={() => {
    // alert('rename not implemented yet')
  }}
>
  {#if isDirectory}
    {#if expanded}
      <span class="i-material-symbols-folder-open align--3px" />
    {:else}
      <span class="i-material-symbols-folder align--3px" />
    {/if}
  {:else}
    <FileIcons basename={name} />
  {/if}
  {name}
</button>

<slot name="buttons" />

<div class="w-2" />
