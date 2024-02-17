// 5 degrees of freedom
const thresholds = {
  0.999: 20.515,
  0.99: 15.086,
  0.95: 11.07,
  0.9: 9.236,
  0.75: 6.63,
  0.5: 4.351,
  0.25: 2.675,
  0.1: 1.61,
  0.05: 1.145,
  0.01: 0.554,
}

const sortedThresholdEntries = Object.entries(thresholds)
  .sort(([, a], [, b]) => b - a)
  .map(([a, b]) => [parseFloat(a), b])

export const chiSquared = (observed: number[], expected: number[]) => {
  if (observed.length !== expected.length) {
    throw new Error('observed and expected must have the same length')
  }

  const totalObserved = observed.reduce((acc, n) => acc + n, 0)
  const totalExpected = expected.reduce((acc, n) => acc + n, 0)
  if (totalObserved !== totalExpected) {
    throw new Error('observed and expected must have the same total')
  }

  return observed.reduce(
    (acc, observed, i) =>
      acc + Math.pow(observed - expected[i], 2) / expected[i],
    0,
  )
}

export const minimumProbabilityD6IsUnfair = (observed: number[]) => {
  const totalObserved = observed.reduce((acc, n) => acc + n, 0)
  const expected = Array.from({ length: observed.length }, () =>
    Math.round(totalObserved / observed.length),
  )
  const currTotalExpected = expected.reduce((acc, n) => acc + n, 0)
  expected[0] += totalObserved - currTotalExpected

  const chiSquaredValue = chiSquared(observed, expected)
  return (sortedThresholdEntries.find(
    ([, threshold]) => chiSquaredValue > threshold,
  ) ?? sortedThresholdEntries.at(-1)!)[0]
}
