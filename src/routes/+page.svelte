<script lang="ts">
  import { browser } from "$app/environment";
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";

  export let data
</script>

<div class="h-100vh">
  <SplitPane pos={28} min={0}>
    <section class="h-full border-r flex flex-col p-3" slot="a">
      Here is where we have content that explains how to setup eslint.config.js, how to write new rules,
      and how to test them. We will have a playbook of different projects, and then let users additional build their own and share them. A fullstack REPL for ESLint across frameworks.
    </section>
    <section class="h-full" slot="b">
      {#if browser}
        {#await import("./Workbench.svelte") then { default: Workbench }}
          <Workbench files={data.projectFiles} />
        {/await}
      {/if}
    </section>
  </SplitPane>
</div>
