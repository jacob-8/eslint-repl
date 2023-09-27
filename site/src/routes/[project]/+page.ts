import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { loadExampleFiles } from './loadExampleFiles'
import { parseExamplesMeta } from './parseExamplesMeta'
import type { ExampleMeta } from '$lib/example.interface'

export const load = (async ({ parent, params: { project: projectName }, fetch }) => {
  const { examplesMeta } = await parent()
  let meta: ExampleMeta = {
    configFocus: 'eslint.config.js',
  }
  let projectFiles: Record<string, string> | undefined

  const { projects, meta: projectMeta } = parseExamplesMeta(examplesMeta, projectName)

  if (projectMeta) {
    meta = projectMeta
    const projectsRawPromises = import.meta.glob(['../../../../examples/**', '!**/example-meta.ts'], { as: 'raw' })
    projectFiles = await loadExampleFiles(projectsRawPromises, projectName)
  }
  else {
    try {
      const response = await fetch(`/api/load/${projectName}`)
      if (response.status !== 200)
        throw new Error('Project not found')
      const files = await response.json() as Record<string, string>
      projectFiles = files
      meta.lintFocus = Object.keys(files)[0]
    }
    catch (error) {
      throw redirect(307, '/basic')
    }
  }

  return { projects, projectName, projectFiles, meta }
}) satisfies PageLoad
