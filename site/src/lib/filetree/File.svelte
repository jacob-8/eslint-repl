<script lang="ts">
  import Item from './Item.svelte'

  export let configFocus: string
  export let lintFocus: string
  export let path: string
  export let depth: number
  $: lintSelected = lintFocus === path
  $: configSelected = configFocus === path

  let selectMode: 'lint' | 'config' = 'lint'
</script>

<div
  class="flex pl-[calc((var(--depth)*.6rem))] !bg-opacity-30 group pr-1"
  style="--depth: {depth};"
  class:bg-gray-600={lintSelected}
  class:bg-blue-800={configSelected}
  class:gray-hover={selectMode === 'lint'}
  class:blue-hover={selectMode === 'config'}
>
  <Item
    {path}
    on:click={() => {
      if (selectMode === 'lint')
        lintFocus = path
      else configFocus = path
    }}
  />
  {#if lintSelected}
    <div class="group-hover:hidden"><span class="i-carbon-arrow-right" /></div>
  {/if}
  {#if configSelected}
    <div class="group-hover:hidden"><span class="i-carbon-arrow-down" /></div>
  {/if}
  <div class="hidden group-hover:block">
    {#if selectMode === 'lint'}
      <span class="i-carbon-arrow-right" />
    {:else}
      <span class="i-carbon-arrow-down" />
    {/if}
  </div>
</div>

<svelte:window
  on:keydown={(e) => {
    if (e.shiftKey)
      selectMode = 'config'
  }}
  on:keyup={(e) => {
    if (selectMode === 'lint')
      return
    if (!e.shiftKey)
      selectMode = 'lint'
  }}
/>

<style>
  .gray-hover {
    --at-apply: hover:bg-gray-500/15;
  }
  .blue-hover {
    --at-apply: hover:bg-blue-700/15;
  }
</style>
