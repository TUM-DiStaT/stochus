import { CommonModule } from '@angular/common'
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { ActiveElement, ChartData, ChartEvent, ChartOptions } from 'chart.js'
import { isEqual } from 'lodash'
import { NgChartsModule } from 'ng2-charts'
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  pairwise,
} from 'rxjs'
import {
  ExtractFromHistogramAssignmentCompletionData,
  ExtractFromHistogramAssignmentConfiguration,
} from '@stochus/assignments/extract-from-histogram-assignment/shared'
import { AssignmentProcessProps } from '@stochus/assignments/model/frontend'
import {
  HistogramOptions,
  computeChartDataForHistogram,
} from '../utils/compute-chart-data-for-histogram'
import { computeChartOptions } from '../utils/compute-chart-options'

@Component({
  standalone: true,
  imports: [CommonModule, NgChartsModule, ReactiveFormsModule],
  templateUrl: './extract-from-histogram-assignment-process.component.html',
})
export class ExtractFromHistogramAssignmentProcessComponent
  implements
    AssignmentProcessProps<
      ExtractFromHistogramAssignmentConfiguration,
      ExtractFromHistogramAssignmentCompletionData
    >,
    OnInit,
    OnDestroy
{
  chartOptions!: ChartOptions
  chartData!: ChartData
  targetValueTypeName = ''
  private _config?: ExtractFromHistogramAssignmentConfiguration

  @Input()
  set config(config: ExtractFromHistogramAssignmentConfiguration) {
    this._config = config
    this.computeChartInput()
    this.targetValueTypeName =
      config.targetProperty === 'median' ? 'Median' : 'Durchschnitt'
  }

  get config(): ExtractFromHistogramAssignmentConfiguration | undefined {
    return this._config
  }

  @Input()
  completionData?: ExtractFromHistogramAssignmentCompletionData | undefined

  @Output()
  updateCompletionData = new EventEmitter<
    Partial<ExtractFromHistogramAssignmentCompletionData>
  >()

  @Output()
  createInteractionLog = new EventEmitter<unknown>()

  targetValueFormControl = new FormControl<number | null>(null, [
    (control) =>
      control.value === null
        ? {
            validNumber: true,
          }
        : null,
  ])
  deletions$ = this.targetValueFormControl.valueChanges.pipe(
    pairwise(),
    filter(
      ([last, curr]) =>
        (last?.toString().length ?? 0) >= (curr?.toString().length ?? 0),
    ),
    map(([old, curr]) => ({
      action: 'deletion' as const,
      old,
      curr,
    })),
  )
  enteredValues$ = this.targetValueFormControl.valueChanges.pipe(
    debounceTime(500),
    map((value) => ({
      action: 'enteredValue' as const,
      value,
    })),
  )
  chartEventsSubject = new Subject<{
    action: 'histogram-hover' | 'histogram-click'
    targets: { datasetLabel: string | undefined; value: string }[]
  }>()
  loggableChartEvents$ = this.chartEventsSubject.pipe(
    distinctUntilChanged((last, curr) => isEqual(last, curr)),
  )

  subscriptions: Subscription[] = []

  submit() {
    if (this.targetValueFormControl.value !== null) {
      this.updateCompletionData.next({
        result: this.targetValueFormControl.value,
        progress: 1,
      })
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.targetValueFormControl.valueChanges.subscribe(() => {
        this.computeChartInput()
      }),
    )
    this.subscriptions.push(
      merge(this.deletions$, this.enteredValues$, this.loggableChartEvents$)
        .pipe(
          distinctUntilChanged(
            (lastEvent, currEvent) =>
              // Ignore enteredValue if the last event was the corresponding deletion
              lastEvent.action === 'deletion' &&
              currEvent.action === 'enteredValue' &&
              lastEvent.curr === currEvent.value,
          ),
        )
        .subscribe((v) => this.createInteractionLog.next(v)),
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  onChartEvent(
    eventType: 'click' | 'hover',
    event: { event?: ChartEvent; active?: object[] },
  ) {
    const activeElements = event.active as ActiveElement[] | undefined
    if (activeElements && activeElements.length > 0) {
      const targets = activeElements.map((activeElement) => {
        const datasetIndex = activeElement.datasetIndex
        const index = activeElement.index
        const dataset = this.chartData.datasets[datasetIndex]
        const value = this.chartData.xLabels?.[index] as string
        return {
          datasetLabel: dataset?.label,
          value,
        }
      })
      this.chartEventsSubject.next({
        action: `histogram-${eventType}`,
        targets,
      })
    }
  }

  private computeChartInput() {
    const options: HistogramOptions = {}

    if (this._config?.targetProperty === 'median') {
      options.customMedian = this.targetValueFormControl.value ?? undefined
    } else if (this._config?.targetProperty === 'mean') {
      options.customMean = this.targetValueFormControl.value ?? undefined
    }

    this.chartData = computeChartDataForHistogram(
      this._config?.data ?? [],
      options,
    )
    this.chartOptions = computeChartOptions(this._config?.data ?? [])
  }
}
