<script lang="ts">
  import { browser } from "$app/environment";
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
</script>

<div class="h-100vh">
  <!-- <SplitPane pos={28} min={0}> -->
  <SplitPane pos={0} min={0}>
    <section class="h-full border-r flex flex-col p-3" slot="a">
      Content explaining how to setup eslint.config.js, how to write a new rule,
      and how to test it.
    </section>
    <section class="h-full" slot="b">
      {#if browser}
        {#await import("./Workbench.svelte") then { default: Workbench }}
          <Workbench />
        {/await}
      {/if}
    </section>
  </SplitPane>
</div>
