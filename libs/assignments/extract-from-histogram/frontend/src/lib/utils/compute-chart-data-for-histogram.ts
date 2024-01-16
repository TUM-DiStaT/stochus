import type { ChartData, ChartDataset } from 'chart.js'

export type HistogramOptions = {
  showMean?: boolean
  showMedian?: boolean
}

export const computeChartDataForHistogram = (
  data: number[],
  options?: HistogramOptions,
): ChartData => {
  // compute frequency of each item in data
  const frequencies = new Map<number, number>()
  let mean = 0
  for (const item of data) {
    frequencies.set(item, (frequencies.get(item) ?? 0) + 1)
    mean += item
  }
  mean /= data.length ?? 1
  const frequencyEntries = [...frequencies.entries()].sort(([a], [b]) => a - b)

  // compute median
  let median = 0
  let medianIndex = 0
  for (const [value, frequency] of frequencyEntries) {
    medianIndex += frequency
    if (medianIndex >= data.length / 2) {
      median = value
      break
    }
  }

  // compute frequencies from start to end, 0 if no frequency is given
  const start = frequencyEntries[0]?.[0] ?? 0
  const end = frequencyEntries.at(-1)?.[0] ?? 0
  const range = end - start + 1
  const frequenciesFromStartToEnd = Array.from(
    { length: range },
    (_, index) => frequencies.get(index + start) ?? 0,
  )
  const labels = Array.from({ length: range }, (_, index) =>
    (index + start).toString(),
  )

  const datasets: ChartDataset[] = [
    {
      label: 'Histogramm',
      type: 'bar',
      data: frequenciesFromStartToEnd,
      yAxisID: 'histogramY',
    },
  ]

  if (options?.showMean) {
    datasets.push({
      type: 'line',
      label: 'Durchschnitt',
      data: Array(range).fill(mean),
      yAxisID: 'inputRangeY',
      datalabels: {
        display: false,
      },
    } as ChartDataset)
  }

  if (options?.showMedian) {
    datasets.push({
      type: 'line',
      label: 'Median',
      data: Array(range).fill(median),
      yAxisID: 'inputRangeY',
      datalabels: {
        display: false,
      },
    } as ChartDataset)
  }

  return {
    labels,
    datasets,
  }
}
