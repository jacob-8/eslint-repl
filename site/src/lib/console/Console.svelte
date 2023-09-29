<script lang="ts">
  import { onMount } from 'svelte'
  import type { WebContainerProcess } from '@webcontainer/api'
  import { getTerminal } from './terminal'
  import 'xterm/css/xterm.css'

  export let shellProcess: WebContainerProcess | null
  let terminalEl: HTMLDivElement
  let terminalWidth: number
  let terminalHeight: number

  onMount(async () => {
    const { terminal } = getTerminal()
    terminal.open(terminalEl)
  })

  $: if (terminalEl && terminalWidth && terminalHeight) {
    const { terminal, fitAddon } = getTerminal()
    fitAddon.fit()
    shellProcess?.resize({
      cols: terminal.cols,
      rows: terminal.rows,
    })
  }
</script>

<div
  class="w-full h-full overflow-hidden"
  bind:clientWidth={terminalWidth}
  bind:clientHeight={terminalHeight}
  bind:this={terminalEl} />

<style>
  div :global(.xterm) {
    height: 100%;
    /* --sk-font-mono: 'JetBrains Mono', 'Fira Mono', monospace; */
  }
  div :global(.xterm .xterm-viewport) {
    background-color: var(--terminal-background) !important;
  }

  /* @font-face {
    font-family: "JetBrains Mono";
    font-style: normal;
    font-weight: 400;
    src: local("JetBrains Mono-Regular"),
      url("./JetBrainsMono-Regular.woff2") format("woff2");
  } */
</style>
