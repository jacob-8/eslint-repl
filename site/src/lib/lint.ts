/* eslint-disable no-console */
import type { Diagnostic } from '@codemirror/lint'
import type { ESLint, Rule } from 'eslint'
import type { NeoCodemirrorOptions } from '@neocodemirror/svelte'
import { checkProjectReady, getWebContainer } from './webcontainer'
import { getPosFromLinesColumns } from './getPosFromLinesColumns'
import { currentLintResults } from './stores/lint-results'

export interface LintResults {
  results: ESLint.LintResult[]
  rulesMeta: RulesMeta
}

export interface RulesMeta {
  [ruleId: string]: Rule.RuleMetaData
}

// `npx eslint --format json-with-metadata --output-file ./lint-result.json ${filename}`
// `echo "export const hello = 'world';" | npx eslint --format json-with-metadata --stdin --stdin-filename index.js`
// `echo "${escapedContent}" | npx eslint --format json-with-metadata --stdin --stdin-filename ${filename}`
// use --fix-dry-run to get the fix info
// const process = await webcontainer.spawn('echo', [`"${escapedContent}"`, '|', 'npx', 'eslint', '--format', 'json-with-metadata', '--stdin', '--stdin-filename', filename])
// const process = await webcontainer.spawn('npx', ['eslint', '--format', 'json-with-metadata', filename])

export async function runLint(filename: string, content: string): Promise<LintResults> {
  console.log(`linting ${filename}`)
  console.time('linting')
  let resultsString = ''
  const webcontainer = await getWebContainer()
  const process = await webcontainer.spawn('node', ['run-lint.js', filename, content])
  process.output.pipeTo(
    new WritableStream({
      write(data) {
        resultsString += data
      },
    }),
  )

  if (await process.exit === 1)
    throw new Error(`lint failed: ${resultsString}`)

  console.timeEnd('linting')
  return JSON.parse(resultsString) as LintResults
}

export function lint(filename: string, content: string): NeoCodemirrorOptions['lint'] {
  return async () => {
    if (!content)
      return []
    await checkProjectReady()
    const lintResults = await runLint(filename, content)
    currentLintResults.set(lintResults)
    console.log({ lintResults })
    return convertLintResultsToDiagnostics(lintResults, content)
  }
};

export function convertLintResultsToDiagnostics({ rulesMeta, results }: LintResults, source: string): Diagnostic[] {
  if (!results.length)
    return []
  const [{ messages, output }] = results
  // console.log({ fixed: output })
  const actualMessages = messages.filter(({ ruleId }) => ruleId)
  return actualMessages.map(({ severity, line, column, endLine, endColumn, message, ruleId, fix }) => {
    let markClass = severity === 2 ? 'cm-lint-mark-error' : 'cm-lint-mark-warning'
    if (fix)
      markClass = 'cm-lint-mark-fixable'

    const ruleDocsUrl = rulesMeta[ruleId!].docs?.url
    const messageString = ruleDocsUrl
      ? `${message} (<a href="${ruleDocsUrl}" target="_blank" style="text-decoration: underline;">${ruleId}</a>)`
      : `${message} (${ruleId})`

    const actions: Diagnostic['actions'] = fix
      ? [
          {
            name: 'Apply Fix',
            apply(view) {
              const [from, to] = fix.range
              view.dispatch({
                changes: [{ from: from - 1, to: to - 1, insert: fix.text }], // TODO: maybe needs one less per line?
              })
              console.log({ from, to, text: fix.text })
            },
          },
        ]
      : []

    return {
      from: getPosFromLinesColumns({ line, column, source: (source as string) }),
      to: getPosFromLinesColumns({ line: endLine || line, column: endColumn || column, source: (source as string) }),
      severity: severity === 2 ? 'error' : 'warning',
      markClass,
      source: 'ESLint',
      actions,
      message, // not using but required by type
      renderMessage() {
        return renderNode(messageString)
      },
    }
  })
}

// function apply() {
//   ($cmInstance.view, 0, 0) => { }
// }

function renderNode(message: string): Element {
  const div = document.createElement('div')
  div.innerHTML = message
  return div
}

export async function getLintConfig(filename: string): Promise<RulesMeta> {
  await checkProjectReady()
  console.log(`getting rules for: ${filename}`)
  console.time('rule-getting')
  let rulesForFileString = ''
  const webcontainer = await getWebContainer()
  const process = await webcontainer.spawn('node', ['get-config.js', filename])
  process.output.pipeTo(
    new WritableStream({
      write(data) {
        rulesForFileString += data
      },
    }),
  )

  if (await process.exit === 1)
    throw new Error(rulesForFileString)
  console.timeEnd('rule-getting')
  return JSON.parse(rulesForFileString) as RulesMeta
}
