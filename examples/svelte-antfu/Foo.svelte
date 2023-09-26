<script lang="ts">
  // @ts-ignore
  let a: number = 1
  let b = 'hi';

  function noNewLine() {
    if (true) return
  }
</script>

{#if a}
  <div>foo</div>
{:else if b}
  <div>bar</div>
{:else if b}
  <div>baz</div>
{/if}

<p>{@html b}</p>