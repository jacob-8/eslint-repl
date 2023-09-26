<script>
  let a = 1;
  let b = 'hi'
</script>

Monaco for viewing linted code w/ warnings+errors (can split to a diff viewer if there are any auto-fix rules)

{#if a}
  <div>foo</div>
{:else if b}
  <div>bar</div>
{:else if b}
  <div>baz</div>
{/if}

<p>{@html b}</p>