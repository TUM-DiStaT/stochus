import { random } from 'lodash'
import { calculateMean } from '@stochus/core/shared'

export type Datasets = [number[], number[], number[], number[]]

export const generateDatasetsWithIdenticalMedian = (): Datasets => {
  const median = random(5, 95)

  return Array.from({ length: 4 }, (): number[] => {
    const range = random(5, 20)
    const length = random(10, 100)
    const lowerBound = random(median - range, median - 1)
    const upperBound = lowerBound + range

    const lowerHalf = Array.from({ length: Math.ceil(length / 2) - 1 }, () =>
      random(lowerBound, median),
    )

    const upperHalf = Array.from({ length: Math.ceil(length / 2) }, () =>
      random(median, upperBound),
    )

    return [...lowerHalf, median, ...upperHalf]
  }) as Datasets
}

export const generateDatasetsWithIdenticalMean = (): Datasets => {
  const desiredMean = random(5, 95)

  return Array.from({ length: 4 }, (): number[] => {
    const range = random(5, 20)
    // this length will probably not be reached exactly
    const roughTargetLength = random(10, 100)
    const lowerBound = random(desiredMean - range, desiredMean - 1)
    const upperBound = lowerBound + range

    const result = Array.from({ length: roughTargetLength / 2 }, () =>
      random(lowerBound, upperBound),
    )

    for (
      let actualMean = calculateMean(result), i = 0;
      actualMean !== desiredMean && i < 1000;
      actualMean = calculateMean(result), i++
    ) {
      // Searching for the "missing element" x so that the actual mean is the desired mean:
      // curr * n + x = mean * (n + 1)
      const requiredForDesiredMean =
        desiredMean * (result.length + 1) - actualMean * result.length

      if (
        lowerBound <= requiredForDesiredMean &&
        requiredForDesiredMean <= upperBound
      ) {
        result.push(requiredForDesiredMean)
      } else if (requiredForDesiredMean < lowerBound) {
        result.push(random(lowerBound, desiredMean))
      } else {
        result.push(random(desiredMean, upperBound))
      }
    }

    return result
  }) as Datasets
}
