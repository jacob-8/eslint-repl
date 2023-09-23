import type { Diagnostic } from '@codemirror/lint'
import type { ESLint } from 'eslint'
import type { NeoCodemirrorOptions } from '@neocodemirror/svelte'
import { spawnLoggingProcess } from './commands'
import { read, waitForProjectReady } from './webcontainer'
import { getPosFromLinesColumns } from './getPosFromLinesColumns'

interface LintResults { results: ESLint.LintResult[]; metadata: ESLint.LintResultData }

// const NO_LINT_ERRORS = 0
// const LINT_ERRORS = 1
const LINT_UNSUCCESFUL = 2

export async function runLint(filename: string): Promise<LintResults> {
  const command = `npx eslint --format json-with-metadata --output-file ./lint-result.json ${filename}`
  console.log(command)
  const process = await spawnLoggingProcess(command)
  if (await process.exit === LINT_UNSUCCESFUL)
    throw new Error('lint failed')

  const resultsString = await read('/lint-result.json')
  return JSON.parse(resultsString) as LintResults
}

export function lint(filename: string): NeoCodemirrorOptions['lint'] {
  return async () => {
    await waitForProjectReady()
    const results = await runLint(filename)
    console.log({ results })
    return convertLintResultsToDiagnostics(results)
  }
};

export function convertLintResultsToDiagnostics({ metadata, results }: LintResults): Diagnostic[] {
  const [{ messages, source }] = results
  return messages.map(({ severity, line, column, endLine, endColumn, message, ruleId, fix }) => {
    let markClass = severity === 2 ? 'cm-lint-mark-error' : 'cm-lint-mark-warning'
    if (fix)
      markClass += ' cm-lint-mark-fixable'

    const ruleDocsUrl = metadata.rulesMeta[ruleId!].docs?.url

    return {
      from: getPosFromLinesColumns({ line, column, source: (source as string) }),
      to: getPosFromLinesColumns({ line: endLine || line, column: endColumn || column, source: (source as string) }),
      severity: severity === 2 ? 'error' : 'warning',
      markClass,
      source: 'ESLint',
      message: `${message} (${ruleId}${ruleDocsUrl ? ` - ${ruleDocsUrl}` : ''})`,
      // actions: message.fix
      //   ? [{
      //       name: 'Fix',
      //       apply: [...message.fix.range],
      //     }]
      //   : [],
    }
  })
}

// function apply() {
//   ($cmInstance.view, 0, 0) => { }
// }
