export async function save(projectName: string, files: Record<string, string>) {
  const value = { files }
  const response = await fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify({ key: projectName, value }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json()
  console.log({ data })
}
