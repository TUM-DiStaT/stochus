import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { ChartData, ChartOptions } from 'chart.js'
import { NgChartsModule } from 'ng2-charts'
import {
  ExtractFromHistogramAssignmentCompletionData,
  ExtractFromHistogramAssignmentConfiguration,
} from '@stochus/assignments/extract-from-histogram-assignment/shared'
import { AssignmentFeedbackProps } from '@stochus/assignments/model/frontend'
import {
  HistogramOptions,
  computeChartDataForHistogram,
} from '../utils/compute-chart-data-for-histogram'
import { computeChartOptions } from '../utils/compute-chart-options'

@Component({
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './extract-from-histogram-assignment-feedback.component.html',
})
export class ExtractFromHistogramAssignmentFeedbackComponent
  implements
    AssignmentFeedbackProps<
      ExtractFromHistogramAssignmentConfiguration,
      ExtractFromHistogramAssignmentCompletionData
    >
{
  result?: {
    correct: boolean
    actualValue: number
  }
  chartOptions!: ChartOptions
  chartData!: ChartData
  targetValueTypeName = ''
  private _completionData!: ExtractFromHistogramAssignmentCompletionData
  private _config?: ExtractFromHistogramAssignmentConfiguration

  @Input()
  set config(config: ExtractFromHistogramAssignmentConfiguration) {
    this._config = config
    this.computeChartInput()
    this.computeResult()
    this.targetValueTypeName =
      config.targetProperty === 'median' ? 'Median' : 'Durchschnitt'
  }

  get config(): ExtractFromHistogramAssignmentConfiguration | undefined {
    return this._config
  }

  @Input()
  set completionData(value: ExtractFromHistogramAssignmentCompletionData) {
    this._completionData = value
    this.computeChartInput()
    this.computeResult()
  }

  get completionData(): ExtractFromHistogramAssignmentCompletionData {
    return this._completionData
  }

  private computeChartInput() {
    const options: HistogramOptions = {}

    if (this._config?.targetProperty === 'median') {
      options.customMedian = this._completionData?.result
      options.showActualMedian = true
    } else if (this._config?.targetProperty === 'mean') {
      options.customMean = this._completionData?.result
      options.showActualMean = true
    }

    this.chartData = computeChartDataForHistogram(
      this._config?.data ?? [],
      options,
    )
    this.chartOptions = computeChartOptions(this._config?.data ?? [])
  }

  private computeResult() {
    if (!this._config || !this._completionData) {
      return
    }

    if (this._config.targetProperty === 'median') {
      const sortedData = [...(this._config.data ?? [])].sort()
      const median =
        sortedData.length % 2 === 0
          ? sortedData[sortedData.length / 2 - 1]
          : sortedData[Math.floor(sortedData.length / 2)]
      this.result = {
        correct: this.completionData.result === median,
        actualValue: median,
      }
    } else if (this._config.targetProperty === 'mean') {
      const mean =
        this._config.data.reduce((acc, curr) => acc + curr, 0) /
        (this._config.data.length ?? 1)
      this.result = {
        correct: this.completionData.result === mean,
        actualValue: mean,
      }
    }
  }
}
