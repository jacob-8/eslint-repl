<script lang="ts">
  import SplitPane from "svelte-pieces/ui/SplitPane.svelte";
</script>

<SplitPane pos={40} min={0}>
  <section class="h-full border-r flex flex-col" slot="a">
    <SplitPane type="vertical" pos={33} min={0}>
      <section class="h-full border-r" slot="a">Tree</section>
      <section class="h-full bg-gray-100" slot="b">
        Monaco for editing rules
      </section>
    </SplitPane>
  </section>
  <section class="h-full bg-gray-200" slot="b">
    <SplitPane type="vertical" pos={90} min={0}>
      <section class="h-full border-r" slot="a">
        Monaco for viewing linted code
      </section>
      <section class="h-full bg-red-100" slot="b">
        Terminal
      </section>
    </SplitPane>
  </section>
</SplitPane>
