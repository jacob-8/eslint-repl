import type { RequestHandler } from './$types'
import { UPSTASH_TOKEN } from '$env/static/private'

export const GET: RequestHandler = async () => {
  fetch('https://humane-oyster-42037.upstash.io/set/foo/bar', {
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
    },
  }).then(response => response.json())
    .then(data => console.log(data))
  return new Response()
}

// import { json } from '@sveltejs/kit'
// import type { RequestHandler } from './$types'
// import { UPSTASH_TOKEN } from '$env/static/private'

// export const POST: RequestHandler = async ({ request }) => {
//   const { key, value } = await request.json()

//   const response = await fetch(`https://humane-oyster-42037.upstash.io/set/${key}`, {
//     method: 'POST',
//     body: JSON.stringify(value), // should be JSON
//     headers: {
//       'Authorization': `Bearer ${UPSTASH_TOKEN}`,
//       'Content-Type': 'application/json',
//     },
//   })
//   const data = await response.json()
//   console.log(data)
//   return json('success')
//   return response
// }
