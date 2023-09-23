import { WebContainer } from '@webcontainer/api'
import type { FileSystemTree, WebContainerProcess } from '@webcontainer/api'
import { type Writable, get, writable } from 'svelte/store'
import { installDependencies, startShell, stubRules } from './commands'

let webcontainer: WebContainer
export const shellProcess: Writable<WebContainerProcess | null> = writable(null)
const projectReady = writable(false)

export async function getWebContainer() {
  if (webcontainer)
    return webcontainer
  console.info('booting webcontainer')
  webcontainer = await WebContainer.boot()
  return webcontainer
}

export async function mount(tree: FileSystemTree) {
  const vm = await getWebContainer()
  console.log('mounting files')
  await clearFileSystem()
  await vm.mount(tree)
}

async function clearFileSystem() {
  console.log('clearing filesystem')
  const vm = await getWebContainer()
  const main_dir = await vm.fs.readdir('./')
  for (const file of main_dir)
    await vm.fs.rm(`./${file}`, { recursive: true })
}

export async function mountProject(tree: FileSystemTree) {
  projectReady.set(false)
  console.log('mounting project')
  await mount(tree)
  await installDependencies()
  if (tree['package.json'].file.contents.includes('"stub":'))
    await stubRules()

  const hasShell = get(shellProcess)
  if (!hasShell)
    shellProcess.set(await startShell())

  projectReady.set(true)
}

export async function waitForProjectReady() {
  console.log('checking if project ready')

  const ready = get(projectReady)
  if (!ready) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return waitForProjectReady()
  }
}

export async function write(path: string, content: string) {
  const vm = await getWebContainer()
  await vm.fs.writeFile(path, content)
}

export async function read(path: string): Promise<string> {
  const vm = await getWebContainer()
  return await vm.fs.readFile(path, 'utf8')
}
