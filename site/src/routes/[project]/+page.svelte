<script lang="ts">
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import { browser } from "$app/environment";
  import Content from "./Content.svelte";
  import { createSearchParamStore } from "$lib/search-param";
  import { save } from "./save";

  export let data;
  const configFocus = createSearchParamStore({
    key: "config",
    startWith: data.meta.lintFocus,
  });
  const lintFocus = createSearchParamStore<string>({
    key: "lint",
    startWith: data.meta.lintFocus,
  });
</script>

<div class="h-100vh" style="--scrollbar-border-color: #1e1e1e;">
  <SplitPane pos={28} min={0}>
    <section class="h-full border-r" slot="a">
      <Content
        projectNames={data.projects}
        activeProjectName={data.projectName}
        activeProjectMarkdown={data.projectFiles["README.md"]}
        on:save={() => save('foo', data.projectFiles)}
      />
    </section>
    <section class="h-full" slot="b">
      {#if browser}
        {#await import("./Workbench.svelte") then { default: Workbench }}
          <Workbench
            projectFiles={data.projectFiles}
            lintModules={data.lintModules}
            bind:lintFocus={$lintFocus}
            bind:configFocus={$configFocus}
          />
        {/await}
      {/if}
    </section>
  </SplitPane>
</div>
