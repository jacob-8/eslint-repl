import { getTerminal } from './terminal'
import { getWebContainer } from './webcontainer'

export async function installDependencies() {
  const process = await spawnLoggingProcess('npm install')
  if (await process.exit !== 0)
    throw new Error('npm install failed')

  return process
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

export async function spawnLoggingProcess(command: string) {
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
