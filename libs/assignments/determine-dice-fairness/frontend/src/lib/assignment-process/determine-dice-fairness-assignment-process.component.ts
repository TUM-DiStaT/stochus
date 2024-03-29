import { CommonModule } from '@angular/common'
import {
  Component,
  EventEmitter,
  HostBinding,
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
  BehaviorSubject,
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  map,
  merge,
  shareReplay,
} from 'rxjs'
import {
  DetermineDiceFairnessAssignmentCompletionData,
  DetermineDiceFairnessAssignmentConfiguration,
} from '@stochus/assignments/determine-dice-fairness/shared'
import { chiSquared } from '@stochus/core/shared'
import { AssignmentProcessProps } from '@stochus/assignments/model/frontend'
import { AnimatedDiceComponent } from '@stochus/core/frontend'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    ReactiveFormsModule,
    AnimatedDiceComponent,
  ],
  templateUrl: './determine-dice-fairness-assignment-process.component.html',
})
export class DetermineDiceFairnessAssignmentProcessComponent
  implements
    AssignmentProcessProps<
      DetermineDiceFairnessAssignmentConfiguration,
      DetermineDiceFairnessAssignmentCompletionData
    >,
    OnInit,
    OnDestroy
{
  @HostBinding('class')
  readonly class = 'flex-1'

  @Input()
  config!: DetermineDiceFairnessAssignmentConfiguration
  @Output()
  createInteractionLog = new EventEmitter<unknown>()
  @Output()
  updateCompletionData = new EventEmitter<
    Partial<DetermineDiceFairnessAssignmentCompletionData>
  >()
  private _completionData!: DetermineDiceFairnessAssignmentCompletionData

  confidenceControl = new FormControl(this._completionData?.confidence)
  debouncedConfidence$ = this.confidenceControl.valueChanges.pipe(
    debounceTime(500),
  )
  confidenceLogs$ = this.debouncedConfidence$.pipe(
    map((confidence) => ({
      action: 'enteredConfidenceValue',
      value: confidence,
    })),
  )

  isFairControl = new FormControl(this._completionData?.isFairGuess ?? null)
  debouncedIsFair$ = this.isFairControl.valueChanges.pipe(debounceTime(500))
  isFairLogs$ = this.debouncedIsFair$.pipe(
    map((isFair) => ({
      action: 'enteredIsFairValue',
      value: isFair,
    })),
  )

  private subscriptions: Subscription[] = []
  rolls$ = new Subject<{
    nextRolls: number[]
    newFrequencies: number[]
  }>()
  $rollLogs = this.rolls$.pipe(
    map(({ nextRolls, newFrequencies }) => {
      return {
        action: 'roll',
        rolls: nextRolls,
        chiSquared: chiSquared(newFrequencies),
      }
    }),
  )
  private completionData$ =
    new BehaviorSubject<DetermineDiceFairnessAssignmentCompletionData>(
      this.completionData,
    )

  chartData$ = this.completionData$.pipe(
    map(
      (completionData): ChartData => ({
        xLabels: [1, 2, 3, 4, 5, 6],
        datasets: [
          {
            label: 'Histogramm',
            type: 'bar',
            data: completionData.resultFrequencies,
            yAxisID: 'histogramY',
            backgroundColor: '#BF9E0D',
            borderColor: '#5F4F07',
          },
        ],
      }),
    ),
    shareReplay(),
  )
  chartOptions: ChartOptions = {
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
  private chartMouseEvents$ = new Subject<{
    action: 'histogram-hover' | 'histogram-click'
    targets: string[]
  }>()
  loggableChartEvents$ = this.chartMouseEvents$.pipe(
    distinctUntilChanged((last, curr) => isEqual(last, curr)),
  )

  onNewRolls(nextRolls: number[]) {
    const newFrequencies = nextRolls.reduce(
      (acc, curr) => {
        acc[curr - 1]++
        return acc
      },
      [...this._completionData.resultFrequencies],
    )
    this.updateCompletionData.emit({ resultFrequencies: newFrequencies })

    this.rolls$.next({ nextRolls, newFrequencies })
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
        const index = activeElement.index

        return chartData.xLabels?.[index] as string
      })

      this.chartMouseEvents$.next({
        action: `histogram-${eventType}`,
        targets,
      })
    }
  }

  ngOnInit() {
    this.isFairControl.setValue(this.completionData.isFairGuess ?? null)
    this.confidenceControl.setValue(this.completionData.confidence)

    this.subscriptions.push(
      merge(
        this.$rollLogs,
        this.loggableChartEvents$,
        this.isFairLogs$,
        this.confidenceLogs$,
      ).subscribe((log) => {
        this.createInteractionLog.emit(log)
      }),
    )

    this.subscriptions.push(
      this.debouncedConfidence$.subscribe((confidence) => {
        this.updateCompletionData.emit({ confidence: confidence ?? undefined })
      }),
    )
    this.subscriptions.push(
      this.isFairControl.valueChanges.subscribe((isFair) => {
        this.updateCompletionData.emit({ isFairGuess: isFair ?? undefined })
      }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  submit() {
    this.updateCompletionData.emit({
      progress: 1,
    })
  }

  get totalRollsCount() {
    return (this._completionData?.resultFrequencies ?? []).reduce(
      (acc, curr) => acc + curr,
      0,
    )
  }

  get completionData(): DetermineDiceFairnessAssignmentCompletionData {
    return this._completionData
  }

  @Input()
  set completionData(value: DetermineDiceFairnessAssignmentCompletionData) {
    this._completionData = value
    this.completionData$.next(value)
  }
}
