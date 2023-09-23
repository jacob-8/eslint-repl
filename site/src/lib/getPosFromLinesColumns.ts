export function getPosFromLinesColumns({ line, column, source }: { line: number; column: number; source: string }) {
  const lines = source.split(/\r?\n/)
  let sum = column
  for (let i = 0; i < line - 1; i++) {
    sum += 1 // for the line break
    sum += (lines.shift()?.length ?? 0)
  }

  return sum - 1 // -1 because CodeMirror starts at 0
}

if (import.meta.vitest) {
  describe(getPosFromLinesColumns, () => {
    it('only 1 line', () => {
      const source = 'export const hello = "world";'

      const line = 1
      const column = 28
      const expected = 27
      const result = getPosFromLinesColumns({ line, column, source })

      expect(result).toEqual(expected)
    })

    it('returns correct position for 2nd line', () => {
      const source = `hello
world
how are you?`

      const line = 2
      const column = 3
      const expected = 8
      const result = getPosFromLinesColumns({ line, column, source })

      expect(result).toEqual(expected)
    })
  })
}
