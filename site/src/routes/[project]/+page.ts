import type { PageLoad } from './$types'
import { loadExampleFiles } from './loadExampleFiles'

export const load = (async ({ params: { project: projectName } }) => {
  const projectsRaw = import.meta.glob(['../../../../examples/**', '!**/example-meta.ts'], { as: 'raw' })
  const projectFiles = await loadExampleFiles(projectsRaw, projectName)
  return { projectName, projectFiles }
}) satisfies PageLoad
