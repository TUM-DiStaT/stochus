import { computeChartDataForHistogram } from './compute-chart-data-for-histogram'

it('should not throw an error when data is empty', () => {
  expect(() => computeChartDataForHistogram([])).not.toThrow()
})

it('should compute correct median when odd number of items', () => {
  const data = [1, 2, 3, 4, 5]
  const chartData = computeChartDataForHistogram(data, {
    showActualMedian: true,
  })
  const medianDataset = chartData.datasets?.find(
    (dataset) => dataset.label === 'Tatsächlicher Median',
  )
  expect(medianDataset?.data).toEqual([3, 3])
})

it('should compute correct median when even number of items', () => {
  const data = [1, 2, 3, 4]
  const chartData = computeChartDataForHistogram(data, {
    showActualMedian: true,
  })
  const medianDataset = chartData.datasets?.find(
    (dataset) => dataset.label === 'Tatsächlicher Median',
  )
  expect(medianDataset?.data).toEqual([2, 2])
})

it('should compute correct mean', () => {
  const data = [1, 2, 3, 4]
  const chartData = computeChartDataForHistogram(data, {
    showActualMean: true,
  })
  const meanDataset = chartData.datasets?.find(
    (dataset) => dataset.label === 'Tatsächlicher Durchschnitt',
  )
  expect(meanDataset?.data).toEqual([2.5, 2.5])
})

it('should compute correct histogram', () => {
  const data = [1, 2, 1, 1, 4, 5, 8, 5, 5, 3, 5]
  const chartData = computeChartDataForHistogram(data)
  const histogramDataset = chartData.datasets?.find(
    (dataset) => dataset.label === 'Histogramm',
  )
  expect(histogramDataset?.data).toEqual([
    3, // 1
    1, // 2
    1, // 3
    1, // 4
    4, // 5
    0, // 6
    0, // 7
    1, // 8
  ])
})

it('should generate labels for all values from min to max, including missing values', () => {
  const data = [3, 8, 1]
  const chartData = computeChartDataForHistogram(data)
  expect(chartData.xLabels).toEqual(['1', '2', '3', '4', '5', '6', '7', '8'])
})
