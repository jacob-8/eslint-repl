<script lang="ts">
  let activeTab: 'first' | 'second' = 'first'
</script>

<div class="border-b border-gray-400 text-gray-300 flex">
  <button
    type="button"
    class="py-1 px-2 border-r border-gray-400"
    class:active={activeTab === 'first'}
    on:click={() => (activeTab = 'first')}>Rules</button
  >
  <button
    type="button"
    class="py-1 px-2"
    class:active={activeTab === 'second'}
    on:click={() => (activeTab = 'second')}>Terminal</button
  >
</div>

{#if activeTab === 'first'}
  <slot name="first" />
{:else}
  <slot name="second" />
{/if}

<style>
  .active {
    --at-apply: font-semibold text-white
  }
</style>
