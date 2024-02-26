import { calculateMean, calculateMedian } from '@stochus/core/shared'
import {
  generateDatasetsWithIdenticalMean,
  generateDatasetsWithIdenticalMedian,
} from './generate-datasets'

it('sanity check: means should be identical', () => {
  const datasets = generateDatasetsWithIdenticalMean(4, 20, 50)
  const [first, ...rest] = datasets.map((d) => calculateMean(d))
  const expected = Array.from({ length: rest.length }, () => first)
  expect(rest).toEqual(expected)
})

it('sanity check: medians should be identical', () => {
  const datasets = generateDatasetsWithIdenticalMedian(4, 20, 50)
  const [first, ...rest] = datasets.map((d) => calculateMedian(d))
  const expected = Array.from({ length: rest.length }, () => first)
  expect(rest).toEqual(expected)
})
