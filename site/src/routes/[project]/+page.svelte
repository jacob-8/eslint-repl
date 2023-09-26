<script lang="ts">
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import { splitIntoProjects } from "./splitIntoProjects";
  import { createSearchParamStore } from "$lib/search-param";

  export let data;
  $: projects = splitIntoProjects(data.projectsRaw, data.lintModulesRaw);
  $: activeProjectName = data.projectName;

  const startConfigFocus = data.meta.configFocus || "eslint.config.js";
  const configFocus = createSearchParamStore({ key: "config", startWith: startConfigFocus, log: true });
  const lintFocus = createSearchParamStore<string>({ key: "lint", startWith: data.meta.lintFocus, log: true });
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
          class:font-bold={name === activeProjectName}>{name}</a
        >
      {/each}

      <div>
        <a
          href="https://github.com/jacob-8/eslint-workbench"
          target="_blank"
          class="p-3 hover:bg-gray-100 rounded block"
        >
          <span class="i-mdi-github text-lg text-gray-800 align--3px" /> View Repo
        </a>
      </div>
    </section>
    <section class="h-full" slot="b">
      {#if lintFocus}
        {#await import("./Workbench.svelte") then { default: Workbench }}
          <Workbench
            projectFiles={projects[activeProjectName]}
            bind:lintFocus={$lintFocus}
            bind:configFocus={$configFocus}
          />
        {/await}
      {/if}
    </section>
  </SplitPane>
</div>
