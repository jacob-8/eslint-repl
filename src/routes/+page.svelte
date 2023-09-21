<script lang="ts">
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
  import Workbench from "./Workbench.svelte";
</script>

<div class="h-100vh">
  <SplitPane pos={28} min={0}>
    <section class="h-full border-r flex flex-col p-3" slot="a">
      Content explaining how to setup eslint.config.js, how to write a new rule,
      and how to test it.
    </section>
    <section class="h-full" slot="b">
      <Workbench />
    </section>
  </SplitPane>
</div>
