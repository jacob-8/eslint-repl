<script lang="ts">
  import { browser } from "$app/environment";
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import { splitIntoProjects } from "./splitIntoProjects";

  export let data;
  $: projects = splitIntoProjects(data.projectsRaw);
  $: projectNames = Object.keys(projects);
  $: activeProjectName = data.projectName;
</script>

<div class="h-100vh">
  <SplitPane pos={28} min={0}>
    <section class="h-full border-r flex flex-col" slot="a">
      <div class="p-3">
        Here is where we have content that explains how to setup
        eslint.config.js, how to write new rules, and how to test them. We will
        have a playbook of different projects, and then let users additional
        build their own and share them. A fullstack REPL for ESLint across
        frameworks.
      </div>
      {#each projectNames as name}
        <a
          class="uppercase p-2 mb-1 bg-gray-200"
          href={`/${name}`}
          class:font-bold={name === activeProjectName}>{name}</a>
      {/each}
    </section>
    <section class="h-full" slot="b">
      {#if browser}
        {#await import("./Workbench.svelte") then { default: Workbench }}
          <!-- use key to reset and reload w/o having to manage things nicely yet -->
          {#key activeProjectName}
            <Workbench files={projects[activeProjectName]} />
          {/key}
        {/await}
      {/if}
    </section>
  </SplitPane>
</div>
