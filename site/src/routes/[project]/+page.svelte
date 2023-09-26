<script lang="ts">
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import { browser } from "$app/environment";
  import Content from "./Content.svelte";
  import { parseExamplesMeta } from "./parseExamplesMeta";
  // import { createSearchParamStore } from "$lib/search-param";

  export let data;
  $: ({projects, meta} = parseExamplesMeta(data.examplesMeta, data.projectName));
  // const configFocus = createSearchParamStore({ key: "config", startWith: startConfigFocus });
  // const lintFocus = createSearchParamStore<string>({ key: "lint", startWith: data.meta.lintFocus });
</script>

<div class="h-100vh" style="--scrollbar-border-color: #1e1e1e;">
  <SplitPane pos={28} min={0}>
    <section class="h-full border-r" slot="a">
      <Content 
        projectNames={projects} 
        activeProjectName={data.projectName} 
        activeProjectMarkdown={data.projectFiles["README.md"]} />
    </section>
    <section class="h-full" slot="b">
      {#if browser}
        {#await import("./Workbench.svelte") then { default: Workbench }}
          <Workbench
            projectFiles={data.projectFiles}
            lintModules={data.lintModules}
            lintFocus={meta.lintFocus || ''}
            configFocus={meta.configFocus || "eslint.config.js"}
          />
        {/await}
      {/if}
    </section>
  </SplitPane>
</div>
