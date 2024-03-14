import type { ChartData, ChartDataset } from 'chart.js'
import { calculateMean, calculateMedian } from '@stochus/core/shared'

export type HistogramOptions = {
  showActualMean?: boolean
  showActualMedian?: boolean
  customMean?: number
  customMedian?: number
  showBoxPlot?: boolean
}
export const computeChartDataForHistogram = (
  data: number[],
  options?: HistogramOptions,
): ChartData => {
  // compute frequency of each item in data
  const frequencies = new Map<number, number>()
  for (const item of data) {
    frequencies.set(item, (frequencies.get(item) ?? 0) + 1)
  }
  const frequencyEntries = [...frequencies.entries()].sort(([a], [b]) => a - b)

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

  // Color palette: https://coolors.co/3b607d-9bafbf-af1b3f-bf9e0d-ffa69e
  const datasets: ChartDataset[] = [
    {
      label: 'Histogramm',
      type: 'bar',
      data: frequenciesFromStartToEnd,
      yAxisID: 'histogramY',
      backgroundColor: '#749EBE',
      borderColor: '#416278',
    },
  ]

  if (options?.customMean !== undefined) {
    datasets.push({
      type: 'line',
      label: 'Eingegebener Durchschnitt',
      data: Array(2).fill(options.customMean),
      xAxisID: 'inputRangeX',
      yAxisID: 'fullVerticalLineY',
      indexAxis: 'y',
      datalabels: {
        display: false,
      },
      backgroundColor: '#FFA69E',
      borderColor: '#FFA69E',
      pointBorderColor: '#FFA69E',
      pointBackgroundColor: '#FFA69E',
    } as ChartDataset)
  }

  if (options?.showActualMean) {
    const mean = calculateMean(data)
    datasets.push({
      type: 'line',
      label: 'Tatsächlicher Durchschnitt',
      data: Array(2).fill(options?.showActualMean ? mean : 0),
      xAxisID: 'inputRangeX',
      yAxisID: 'fullVerticalLineY',
      indexAxis: 'y',
      datalabels: {
        display: false,
      },
      backgroundColor: '#AF1B3F',
      borderColor: '#AF1B3F',
      pointBorderColor: '#AF1B3F',
      pointBackgroundColor: '#AF1B3F',
    } as ChartDataset)
  }

  if (options?.customMedian !== undefined) {
    datasets.push({
      type: 'line',
      label: 'Eingegebener Median',
      data: Array(2).fill(options.customMedian),
      xAxisID: 'inputRangeX',
      yAxisID: 'fullVerticalLineY',
      indexAxis: 'y',
      datalabels: {
        display: false,
      },
      backgroundColor: '#FFA69E',
      borderColor: '#FFA69E',
      pointBorderColor: '#FFA69E',
      pointBackgroundColor: '#FFA69E',
    } as ChartDataset)
  }

  if (options?.showActualMedian) {
    const median = calculateMedian(data)

    datasets.push({
      type: 'line',
      label: 'Tatsächlicher Median',
      data: Array(2).fill(median),
      xAxisID: 'inputRangeX',
      yAxisID: 'fullVerticalLineY',
      indexAxis: 'y',
      datalabels: {
        display: false,
      },
      backgroundColor: '#AF1B3F',
      borderColor: '#AF1B3F',
      pointBorderColor: '#AF1B3F',
      pointBackgroundColor: '#AF1B3F',
    } as ChartDataset)
  }

  if (options?.showBoxPlot) {
    datasets.push({
      type: 'boxplot' as string,
      label: 'Boxplot',
      // Type definition doesn't include box plots, where data must be number[][]
      // TODO: Expand type definition somehow
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: [data] as any,
      xAxisID: 'inputRangeX',
      yAxisID: 'boxplotY',
      indexAxis: 'y',
      datalabels: {
        display: false,
      },
      backgroundColor: '#CDD7DF',
      borderColor: '#3B607D',
      pointBorderColor: '#3B607D',
      pointBackgroundColor: '#CDD7DF',
    } as ChartDataset)
  }

  return {
    // labels,
    xLabels: labels,
    yLabels: ['0', '1'],
    datasets,
  }
}
