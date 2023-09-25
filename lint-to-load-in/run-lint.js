/* eslint-disable node/prefer-global/process */
import pkg from 'eslint/use-at-your-own-risk'

const { FlatESLint } = pkg

;(async function main() {
  const [filePath, codeToLint] = process.argv.slice(2)

  /** @type {import('eslint/lib/eslint/flat-eslint').FlatESLint} */
  const eslint = new FlatESLint()

  const results = await eslint.lintText(codeToLint, { filePath })
  const rulesMeta = eslint.getRulesMetaForResults(results)
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ results, rulesMeta }))
})().catch((error) => {
  process.exitCode = 1
  console.error(error)
})
