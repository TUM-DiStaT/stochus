import { ChartData, ChartOptions } from 'chart.js'
import { DetermineDiceFairnessAssignmentCompletionData } from '@stochus/assignments/determine-dice-fairness/shared'

export const mapCompletionDataToChartData = (
  completionData: DetermineDiceFairnessAssignmentCompletionData,
): ChartData => ({
  xLabels: [1, 2, 3, 4, 5, 6],
  datasets: [
    {
      label: 'Histogramm',
      type: 'bar',
      data: completionData.resultFrequencies,
      yAxisID: 'histogramY',
      backgroundColor: '#749EBE',
      borderColor: '#416278',
    },
  ],
})

export const chartOptions: ChartOptions = {
  maintainAspectRatio: false,
  scales: {
    inputRangeX: {
      type: 'linear',
      position: 'bottom',
      axis: 'x',
      // compute custom grace / offset to account for bar widths
      // in the bar chart. this ensures that some x position here
      // aligns perfectly with the center of the corresponding bar
      min: 1 - 0.5,
      max: 6 + 0.5,
      grace: 0,
      offset: false,
      display: false,
    },
    histogramY: {
      type: 'linear',
      position: 'left',
      axis: 'y',
      title: {
        text: 'Häufigkeit',
        display: true,
      },
      ticks: {
        stepSize: 1,
      },
    },
  },
  animation: false,
  plugins: {
    legend: {
      display: true,
    },
    datalabels: {
      anchor: 'end',
      align: 'end',
    },
  },
}
