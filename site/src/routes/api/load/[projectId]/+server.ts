import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { UPSTASH_TOKEN } from '$env/static/private'

export const GET: RequestHandler = async ({ params: { projectId } }) => {
  try {
    const response = await fetch(`https://humane-oyster-42037.upstash.io/get/${projectId}`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
      },
    })
    const data = await response.json() as { result: string }
    if (!data?.result)
      throw new Error('Project not found')
    const result = JSON.parse(data.result) as { files: Record<string, string> }
    if (!Object.keys(result.files).length)
      throw new Error('Project not found')
    return json(result.files)
  }
  catch {
    throw error(404, 'Project not found')
  }
}
