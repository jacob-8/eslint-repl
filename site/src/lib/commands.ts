import { getTerminal } from './terminal'
import { getWebContainer, projectStatus } from './webcontainer'

export async function installDependencies() {
  projectStatus.set('installing')

  const process = await spawnLoggingProcess('npm install')
  if (await process.exit !== 0)
    throw new Error('npm install failed')

  return process
}

export async function stubRules() {
  projectStatus.set('stubbing')

  const process = await spawnLoggingProcess('npm run stub')
  if (await process.exit !== 0)
    throw new Error('stub failed')

  return process
}

export async function startShell() {
  projectStatus.set('starting-shell')

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
