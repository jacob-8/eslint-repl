<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";

  export let projectNames: string[];
  export let activeProjectName: string;
  export let activeProjectMarkdown: string;
</script>

<div class="font-semibold flex justify-between items-center">
  <a href="/" class="p-3 hover:underline rounded text-lg">
    <span class="i-logos-eslint text-gray-800 align--2px mr-2" />ESLint REPL
  </a>
  <a
    href="https://github.com/jacob-8/eslint-workbench"
    target="_blank"
    class="p-3 hover:opacity-100 opacity-60 rounded"
  >
    <span class="i-mdi-github text-lg text-gray-800 align--3px" />
  </a>
</div>

{#each projectNames as name}
  {@const active = name === activeProjectName}
  <div class:active class="flex flex-col">
    <a
      class="capitalize p-2 hover:bg-gray-100 rounded"
      href={`/${name}`}
      class:font-bold={active}>{name}</a
    >

    {#if active}
      <div class="px-2 prose">
        <SvelteMarkdown source={activeProjectMarkdown} />
      </div>
    {/if}
  </div>
{/each}

<style>
  .active {
    --at-apply: border;
  }
</style>