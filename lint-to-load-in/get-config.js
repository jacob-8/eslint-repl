/* eslint-disable no-console */
/* eslint-disable node/prefer-global/process */
import pkg from 'eslint/use-at-your-own-risk'

const { FlatESLint } = pkg

  ; (async function main() {
  const [filePath] = process.argv.slice(2)

  /** @type {import('eslint/lib/eslint/flat-eslint').FlatESLintOptions} */
  // const options = {
  // fix: true,
  // }

  /** @type {import('eslint/lib/eslint/flat-eslint').FlatESLint} */
  const eslint = new FlatESLint()
  const config = await eslint.calculateConfigForFile(filePath)

  if (!config)
    throw new Error(`No ESLint configuration applies to ${filePath}`)

  if (!config.rules)
    throw new Error(`No ESLint rules apply to ${filePath}`)

  const ruleIds = Object.keys(config.rules)

  /** @type {import('eslint/lib/shared/types').LintResult[]} */
  const results = ruleIds.map((ruleId) => {
    return {
      messages: [{ ruleId }],
      filePath,
      suppressedMessages: [],
    }
  })

  const rulesMeta = eslint.getRulesMetaForResults(results)

  console.log(JSON.stringify(rulesMeta))
})().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})

// const rulesMetaCustom = eslint.getRulesMetaForResults([{ suppressedMessages: [], filePath: '<text>', messages: [{ ruleId: 'no-unused-vars' }] }])

// CLI method
// ./node_modules/.bin/eslint --print-config *.js
// npx eslint --print-config lint-me.js > get-config-output.json
