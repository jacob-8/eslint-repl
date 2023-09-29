<script lang="ts">
  import type { FileSystemTree } from '@webcontainer/api'
  import { createEventDispatcher } from 'svelte'
  import Folder from './Folder.svelte'

  export let tree: FileSystemTree
  export let configFocus: string
  export let lintFocus: string

  const dispatch = createEventDispatcher<{ add: string }>()
</script>

<div class="h-full bg-[--scrollbar-border-color] overflow-y-auto overflow-x-hidden text-white/70 pt-1" style="--scrollbar-border-color: hsl(0, 0%, 9%);">
  <Folder {tree} path="" depth={0} expanded bind:lintFocus bind:configFocus />

  <button
    type="button"
    on:click={() => {
      const fileName = prompt(
        'What\'s the full path of your new file, e.g. \'foo.js\' or \'src/routes/+page.svelte\'?',
      )
      if (!fileName)
        return
      dispatch('add', fileName)
    }}
    class="block w-full text-left pl-[calc((var(--depth)*.6rem))] opacity-70 hover:opacity-100 hover:bg-gray-500/15"
    style="--depth: 1;">+ add file</button>
</div>
