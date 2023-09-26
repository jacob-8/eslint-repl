import { WebContainer } from '@webcontainer/api'
import type { FileSystemTree, WebContainerProcess } from '@webcontainer/api'
import { type Writable, get, writable } from 'svelte/store'
import { installDependencies, startShell, stubRules } from './commands'

let webcontainer: WebContainer
export const shellProcess: Writable<WebContainerProcess | null> = writable(null)
type ProjectStatus = null | 'booting' | 'mounting' | 'installing' | 'stubbing' | 'starting-shell' | 'ready' | 'error'
export const projectStatus = writable<ProjectStatus>(null)

export async function getWebContainer() {
  if (webcontainer)
    return webcontainer
  projectStatus.set('booting')
  webcontainer = await WebContainer.boot()
  return webcontainer
}

export async function mount(tree: FileSystemTree) {
  const vm = await getWebContainer()
  await clearFileSystem()
  projectStatus.set('mounting')
  await vm.mount(tree)
}

async function clearFileSystem() {
  const afterInitialBoot = get(projectStatus) === 'booting'
  if (afterInitialBoot)
    return

  // eslint-disable-next-line no-console
  console.log('clearing file system')
  const vm = await getWebContainer()
  const main_dir = await vm.fs.readdir('./')
  for (const file of main_dir)
    await vm.fs.rm(`./${file}`, { recursive: true })
}

export async function initProjectInWebContainer(tree: FileSystemTree) {
  await mount(tree)
  await installDependencies()
  if ('file' in tree['package.json']) {
    const packageJsonContents = tree['package.json'].file.contents as string
    if (packageJsonContents.includes('"stub":'))
      await stubRules()
  }

  const hasShell = get(shellProcess)
  if (!hasShell)
    shellProcess.set(await startShell())

  projectStatus.set('ready')
}

export async function checkProjectReady() {
  // eslint-disable-next-line no-console
  console.log('linter checking if project ready')

  const status = get(projectStatus)
  if (status === 'ready' || status === 'starting-shell')
    return

  await new Promise(resolve => setTimeout(resolve, 100))
  return checkProjectReady()
}

export async function write(path: string, content: string) {
  const vm = await getWebContainer()
  await vm.fs.writeFile(path, content)
}

export async function read(path: string): Promise<string> {
  const vm = await getWebContainer()
  return await vm.fs.readFile(path, 'utf8')
}

export async function remove(path: string) {
  const vm = await getWebContainer()
  return await vm.fs.rm(path)
}
