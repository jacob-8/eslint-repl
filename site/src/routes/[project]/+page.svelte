<script lang="ts">
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import { splitIntoProjects } from "./splitIntoProjects";
  // import { createSearchParamStore } from "$lib/search-param";
  import { browser } from "$app/environment";
  import Content from "./Content.svelte";

  export let data;
  $: projects = splitIntoProjects(data.projectsRaw, data.lintModulesRaw);
  $: activeProjectName = data.projectName;

  const configFocus = data.meta.configFocus || "eslint.config.js";
  // const configFocus = createSearchParamStore({ key: "config", startWith: startConfigFocus });
  // const lintFocus = createSearchParamStore<string>({ key: "lint", startWith: data.meta.lintFocus });
</script>

<div class="h-100vh" style="--scrollbar-border-color: #1e1e1e;">
  <SplitPane pos={28} min={0}>
    <section class="h-full border-r p-1" slot="a">
      <Content 
        projectNames={Object.keys(projects)} 
        activeProjectName={activeProjectName} 
        activeProjectMarkdown={projects[activeProjectName]["README.md"]} />
    </section>
    <section class="h-full" slot="b">
      {#if browser}
        {#await import("./Workbench.svelte") then { default: Workbench }}
          <Workbench
            projectFiles={projects[activeProjectName]}
            lintFocus={data.meta.lintFocus || ''}
            configFocus={configFocus}
          />
        {/await}
      {/if}
    </section>
  </SplitPane>
</div>
