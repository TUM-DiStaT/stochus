import { AsyncPipe } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import {
  BoxAndWiskers,
  BoxPlotController,
} from '@sgratzl/chartjs-chart-boxplot'
import {
  ActiveElement,
  CategoryScale,
  Chart,
  ChartEvent,
  LinearScale,
} from 'chart.js'
import DataLabelsPlugin from 'chartjs-plugin-datalabels'
import { isEqual } from 'lodash'
import { NgChartsConfiguration, NgChartsModule } from 'ng2-charts'
import {
  BehaviorSubject,
  distinctUntilChanged,
  firstValueFrom,
  map,
  shareReplay,
} from 'rxjs'
import {
  HistogramOptions,
  computeChartDataForHistogram,
} from './compute-chart-data-for-histogram'
import { computeChartOptions } from './compute-chart-options'

@Component({
  standalone: true,
  selector: 'stochus-histogram',
  templateUrl: './histogram.component.html',
  providers: [
    {
      provide: NgChartsConfiguration,
      useValue: {
        generateColors: true,
        plugins: [DataLabelsPlugin],
      } satisfies NgChartsConfiguration,
    },
  ],
  imports: [AsyncPipe, NgChartsModule],
})
export class HistogramComponent implements OnInit {
  private readonly histogramOptions$ = new BehaviorSubject<
    HistogramOptions & { data?: number[] }
  >({})
  private readonly distinctHistogramOptions$ = this.histogramOptions$.pipe(
    distinctUntilChanged(isEqual),
  )

  readonly chartData$ = this.distinctHistogramOptions$.pipe(
    map(({ data, ...options }) => {
      return data ? computeChartDataForHistogram(data, options) : undefined
    }),
    shareReplay(1),
  )

  readonly chartOptions$ = this.distinctHistogramOptions$.pipe(
    distinctUntilChanged((a, b) => isEqual(a.data, b.data)),
    map(({ data }) => {
      return data ? computeChartOptions(data) : undefined
    }),
    shareReplay(1),
  )

  @Input()
  set data(data: number[] | null | undefined) {
    if (data) {
      this.histogramOptions$.next({ ...this.histogramOptions$.value, data })
    }
  }

  @Input()
  set showActualMean(showActualMean: boolean | undefined | '') {
    this.histogramOptions$.next({
      ...this.histogramOptions$.value,
      showActualMean: showActualMean === '' || showActualMean === true,
    })
  }

  @Input()
  set showActualMedian(showActualMedian: boolean | undefined | '') {
    this.histogramOptions$.next({
      ...this.histogramOptions$.value,
      showActualMedian: showActualMedian === '' || showActualMedian === true,
    })
  }

  @Input()
  set showBoxPlot(showBoxPlot: boolean | undefined | '') {
    this.histogramOptions$.next({
      ...this.histogramOptions$.value,
      showBoxPlot: showBoxPlot === '' || showBoxPlot === true,
    })
  }

  @Input()
  set customMean(customMean: number | null | undefined) {
    this.histogramOptions$.next({
      ...this.histogramOptions$.value,
      customMean: customMean ?? undefined,
    })
  }

  @Input()
  set customMedian(customMedian: number | null | undefined) {
    this.histogramOptions$.next({
      ...this.histogramOptions$.value,
      customMedian: customMedian ?? undefined,
    })
  }

  @Output()
  chartMouseEvent = new EventEmitter<{
    action: 'histogram-hover' | 'histogram-click'
    targets: { datasetLabel: string | undefined; value: string }[]
  }>()

  ngOnInit() {
    Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale)
  }

  async onChartEvent(
    eventType: 'click' | 'hover',
    event: { event?: ChartEvent; active?: object[] },
  ) {
    const activeElements = event.active as ActiveElement[] | undefined
    // should immediately respond thanks to shareReplay
    const chartData = await firstValueFrom(this.chartData$)
    if (activeElements && activeElements.length > 0 && chartData) {
      const targets = activeElements.map((activeElement) => {
        const datasetIndex = activeElement.datasetIndex
        const index = activeElement.index

        const dataset = chartData.datasets[datasetIndex]
        const value = chartData.xLabels?.[index] as string
        return {
          datasetLabel: dataset?.label,
          value,
        }
      })
      this.chartMouseEvent.next({
        action: `histogram-${eventType}`,
        targets,
      })
    }
  }
}
