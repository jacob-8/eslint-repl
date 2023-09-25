import { derived, writable } from 'svelte/store'
import type { LintResults } from '$lib/lint'

export const currentLintResults = writable<LintResults>({ results: [], rulesMeta: {} })
export const currentViolationRuleIds = derived(currentLintResults, ({ rulesMeta }) => Object.keys(rulesMeta))
