import { CommonModule } from '@angular/common'
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { ActiveElement, ChartData, ChartEvent, ChartOptions } from 'chart.js'
import { isEqual, random } from 'lodash'
import { NgChartsModule } from 'ng2-charts'
import {
  BehaviorSubject,
  Subject,
  Subscription,
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
import { AssignmentProcessProps } from '@stochus/assignments/model/frontend'

@Component({
  selector: 'lib-determine-dice-fairness-assignment-process',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
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
  @Input()
  config!: DetermineDiceFairnessAssignmentConfiguration
  @Output()
  createInteractionLog = new EventEmitter<unknown>()
  @Output()
  updateCompletionData = new EventEmitter<
    Partial<DetermineDiceFairnessAssignmentCompletionData>
  >()
  private _completionData!: DetermineDiceFairnessAssignmentCompletionData

  private subscriptions: Subscription[] = []
  rolls$ = new Subject<number[]>()
  $rollLogs = this.rolls$.pipe(
    map((rolls) => ({
      action: 'roll',
      rolls,
      curr: 1,
      value: 1,
    })),
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

  rollDice() {
    const nextRolls = Array.from({ length: this.config.dicePerRoll }, () =>
      random(1, 6),
    )
    this.rolls$.next(nextRolls)

    const newFrequencies = nextRolls.reduce(
      (acc, curr) => {
        acc[curr - 1]++
        return acc
      },
      [...this._completionData.resultFrequencies],
    )
    this.updateCompletionData.emit({ resultFrequencies: newFrequencies })
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
    this.subscriptions.push(
      merge(this.$rollLogs, this.loggableChartEvents$)
        .pipe(
          distinctUntilChanged(
            (lastEvent, currEvent) =>
              // Ignore enteredValue if the last event was the corresponding deletion
              lastEvent.action === 'deletion' &&
              currEvent.action === 'enteredValue' &&
              lastEvent.curr === currEvent.value,
          ),
        )
        .subscribe((log) => {
          this.createInteractionLog.emit(log)
        }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
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
