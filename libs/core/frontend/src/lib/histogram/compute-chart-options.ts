import type { ChartOptions } from 'chart.js'

export const computeChartOptions = (data: number[]) => {
  const min = Math.min(...data)
  const max = Math.max(...data)
  return {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      inputRangeX: {
        type: 'linear',
        position: 'bottom',
        axis: 'x',
        // compute custom grace / offset to account for bar widths
        // in the bar chart. this ensures that some x position here
        // aligns perfectly with the center of the corresponding bar
        min: min - 0.5,
        max: max + 0.5,
        grace: 0,
        offset: false,
        display: false,
      },
      fullVerticalLineY: {
        type: 'linear',
        position: 'right',
        axis: 'y',
        min: 0,
        max: 1,
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
        grace: '10%',
      },
      boxplotY: {
        type: 'category',
        axis: 'y',
        labels: ['Boxplot'],
        display: false,
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
  } as ChartOptions
}
