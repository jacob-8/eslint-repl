import { getTerminal } from './terminal'
import { getWebContainer, read } from './webcontainer'

export async function installDependencies() {
  const process = await spawnLoggingProcess('npm install')
  if (await process.exit !== 0)
    throw new Error('npm install failed')

  return process
}

// const NO_LINT_ERRORS = 0
// const LINT_ERRORS = 1
const LINT_UNSUCCESFUL = 2

export async function runLint(filename: string) {
  const command = `npx eslint --format json-with-metadata --output-file ./lint-result.json ${filename}`
  console.log(command)
  const process = await spawnLoggingProcess(command)
  if (await process.exit === LINT_UNSUCCESFUL)
    throw new Error('lint failed')

  const resultsString = await read('/lint-result.json')
  return JSON.parse(resultsString)
}

export async function stubRules() {
  console.log('stubbing rules')
  const process = await spawnLoggingProcess('npm run stub')
  if (await process.exit !== 0)
    throw new Error('stub failed')

  return process
}

export async function startShell() {
  const webcontainer = await getWebContainer()
  const { terminal } = getTerminal()
  const process = await webcontainer.spawn('jsh', {
    terminal: {
      cols: terminal.cols,
      rows: terminal.rows,
    },
  })
  process.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data)
      },
    }),
  )

  const input = process.input.getWriter()
  terminal.onData((data) => {
    input.write(data)
  })

  return process
}

async function spawnLoggingProcess(command: string) {
  const webcontainer = await getWebContainer()
  const { terminal } = getTerminal()
  const [main_command, ...args] = command.split(' ')
  const process = await webcontainer.spawn(main_command, args)
  process.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data)
      },
    }),
  )
  return process
}
