<script lang="ts">
  /** eslint-disable unused-imports/no-unused-vars */
  const fixable = 'code'

  // eslint-disable-next-line unused-imports/no-unused-vars
  const shouldMakeOneLine = ['hi', 'world']
  // eslint-disable-next-line unused-imports/no-unused-vars
  const shouldMakeEachOnOwnLine = [
    'hi',
    'world',
  ]
</script>

<span class="text-gray-200 text-sm text-bold" title={fixable}
>(fixable)</span
>

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
    on:click={() => (activeTab = 'second')}
  >Terminal</button
  >
</div>
