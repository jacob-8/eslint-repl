<script lang="ts">
  import { onMount } from "svelte";
  import { fitAddon, terminal } from "$lib/terminal";
  let terminalEl: HTMLDivElement;
  let terminalWidth: number;
  let terminalHeight: number;

  onMount(async () => {
    terminal.open(terminalEl);
  });

  $: if (terminalEl && terminalWidth && terminalHeight) {
    fitAddon.fit();
  }
</script>

<div
  class="w-full h-full overflow-hidden"
  bind:clientWidth={terminalWidth}
  bind:clientHeight={terminalHeight}
  bind:this={terminalEl}
/>

<style>
  div :global(.xterm) {
    height: 100%;
  }
</style>
