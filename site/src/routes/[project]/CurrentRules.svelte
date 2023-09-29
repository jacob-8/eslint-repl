<script lang="ts">
  import type { RulesMeta } from '$lib/lint'

  export let rulesMeta: RulesMeta
  export let currentViolationRuleIds: string[]
  export let filename: string

  $: rules = Object.entries(rulesMeta).map(([ruleName, { docs, fixable }]) => ({
    ruleName,
    docs,
    fixable,
  }))

  $: rulesWithViolations = rules.filter(({ ruleName }) => currentViolationRuleIds.includes(ruleName))

  $: rulesWithoutViolations = rules.filter(
    ({ ruleName }) => !currentViolationRuleIds.includes(ruleName),
  )
</script>

<div class="p-2 bg-black bg-[var(--terminal-background)] h-full overflow-y-auto">
  {#if rulesWithViolations.length}
    <div class="text-gray-400 text-xs mb-1">Rules Not violated</div>
    {#each rulesWithViolations as { ruleName, docs, fixable }}
      <div class:text-green-400={fixable} class:text-pink-400={!fixable}>
        {#if docs}
          <a href={docs.url} target="_blank" class="font-semibold underline">
            {ruleName}
          </a>
          - {docs.description}
        {:else}
          <span class="font-semibold">{ruleName}</span>
        {/if}
        {#if fixable}
          <span class="text-gray-200 text-sm text-bold" title={fixable}>(fixable)</span>
        {/if}
      </div>
    {/each}
    <div class="border-b my-3 border-gray-400" />
  {/if}

  {#if rulesWithoutViolations.length}
    <div class="text-gray-400 text-xs mb-1">
      Other rules applying to {filename}
    </div>

    {#each rulesWithoutViolations as { ruleName, docs, fixable }}
      <div class="text-cyan-400">
        {#if docs}
          <a href={docs.url} target="_blank" class="font-semibold underline">
            {ruleName}
          </a>
          - {docs.description}
        {:else}
          <span class="font-semibold">{ruleName}</span>
        {/if}
        {#if fixable}
          <span class="text-gray-200 text-sm text-bold" title={fixable}>(fixable)</span>
        {/if}
      </div>
    {/each}
  {/if}
</div>
