<script lang="ts">
  import { browser } from "$app/environment";
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import { splitIntoProjects } from "./splitIntoProjects";

  export let data;
  $: projects = splitIntoProjects(data.projectsRaw, data.lintModulesRaw);
  $: activeProjectName = data.projectName;
  let lintFocus: string
  let configFocus = 'eslint.config.js'

  $: if (browser && data.projectsMeta) loadMeta()
  async function loadMeta() {
    const metaPromise = data.projectsMeta[`../../../../examples/${activeProjectName}/example-meta.ts`]
    if (metaPromise) {
      const { meta } = await metaPromise()
      lintFocus = meta.lintFocus
      if (meta.configFocus) {
        configFocus = meta.configFocus
      }
    }
  }
</script>

<div class="h-100vh" style="--scrollbar-border-color: #1e1e1e;">
  <SplitPane pos={28} min={0}>
    <section class="h-full border-r flex flex-col" slot="a">
      <div class="p-3">
        Here is where we have content that explains how to setup
        eslint.config.js, how to write new rules, and how to test them. We will
        have a playbook of different projects, and then let users additional
        build their own and share them. A fullstack REPL for ESLint across
        frameworks.
      </div>
      {#each Object.keys(projects) as name}
        <a
          class="uppercase p-2 mb-1 bg-gray-200"
          href={`/${name}`}
          class:font-bold={name === activeProjectName}>{name}</a>
      {/each}
    </section>
    <section class="h-full" slot="b">
      {#if lintFocus}
        {#await import("./Workbench.svelte") then { default: Workbench }}
          <Workbench projectFiles={projects[activeProjectName]} {lintFocus} {configFocus} />
        {/await}
      {/if}
    </section>
  </SplitPane>
</div>
