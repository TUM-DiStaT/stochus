export const calculateMean = (data: number[]) =>
  data.reduce((a, b) => a + b, 0) / data.length

export const calculateMedian = (data: number[]) => {
  const sortedData = [...data].sort((a, b) => a - b)
  const middleIndex = Math.floor(sortedData.length / 2)
  return sortedData.length % 2 === 0
    ? sortedData[middleIndex - 1]
    : sortedData[middleIndex]
}
