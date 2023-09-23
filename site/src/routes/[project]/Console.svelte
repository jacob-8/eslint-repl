<script lang="ts">
  import { onMount } from "svelte";
  import { getTerminal } from "$lib/terminal";
  import type { WebContainerProcess } from "@webcontainer/api";

  export let shellProcess: WebContainerProcess | null
  let terminalEl: HTMLDivElement;
  let terminalWidth: number;
  let terminalHeight: number;

  onMount(async () => {
    const { terminal } = getTerminal();
    terminal.open(terminalEl);
  });

  $: if (terminalEl && terminalWidth && terminalHeight) {
    const { terminal, fitAddon } = getTerminal();
    console.log('resizing shell')
    fitAddon.fit();
    shellProcess?.resize({
      cols: terminal.cols,
      rows: terminal.rows,
    });
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
