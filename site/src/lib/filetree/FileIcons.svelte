<script lang="ts">
  export let basename = ''
  $: ext = basename.split('.').pop() as string
</script>

{#if ext === 'svelte'}
  <span class="i-vscode-icons-file-type-svelte" />
{:else if ext === 'vue'}
  <span class="i-vscode-icons-file-type-vue" />
{:else if ext === 'jsx'}
  <span class="i-vscode-icons-file-type-reactjs" />
{:else if ext === 'tsx'}
  <span class="i-vscode-icons-file-type-reactts" />
{:else if basename === 'eslint.config.js' || basename === 'eslintrc.js'}
  <span class="i-vscode-icons-file-type-eslint" />
{:else if basename === 'package.json' || basename === 'package-lock.json'}
  <span class="i-vscode-icons-file-type-npm" />
{:else if basename === 'vite.config.js'}
  <span class="i-vscode-icons-file-type-vite" />
{:else if ['ts', 'mts', 'cts'].includes(ext)}
  <span class="i-vscode-icons-file-type-typescript" />
{:else if ['js', 'mjs', 'cjs'].includes(ext)}
  <span class="i-vscode-icons-file-type-js" />
{:else if ext === 'css'}
  <span class="i-vscode-icons-file-type-css" />
{:else if ext === 'json'}
  <span class="i-vscode-icons-file-type-json" />
{:else if ext === 'html'}
  <span class="i-vscode-icons-file-type-html" />
{:else if ext === 'md'}
  <span class="i-vscode-icons-file-type-markdown" />
{:else if ['png', 'svg', 'jpg', 'jpeg'].includes(ext)}
  <span class="i-vscode-icons-file-type-image" />
{:else if basename.startsWith('.env')}
  <span class="i-vscode-icons-file-type-config" />
{:else if basename === '.gitignore'}
  <span class="i-vscode-icons-file-type-git" />
{:else}
  <span class="i-vscode-icons-default-file" />
{/if}

<style>
  span {
    vertical-align: -3px;
  }
</style>
