export const parseIntegersCsv = (csv?: string | null) => {
  if (csv === null || csv === undefined) {
    throw new Error('No CSV provided')
  }

  const parsedCsv: number[] | undefined = csv
    .split(/\s*,\s*/gim)
    .filter(Boolean)
    .map((value) => parseFloat(value))

  if (
    parsedCsv?.some(
      (value) =>
        isNaN(value) || !isFinite(value) || Math.floor(value) !== value,
    )
  ) {
    throw new Error('Invalid CSV')
  }

  return parsedCsv
}
