import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { isEqual, shuffle } from 'lodash'
import { Subscription, distinctUntilChanged, map } from 'rxjs'
import {
  IdentifySharedCharacteristicsAssignmentCompletionData,
  IdentifySharedCharacteristicsAssignmentConfiguration,
} from '@stochus/assignments/identify-shared-characteristics/shared'
import { AssignmentProcessProps } from '@stochus/assignments/model/frontend'
import { HistogramComponent } from '@stochus/core/frontend'

@Component({
  standalone: true,
  templateUrl:
    './identify-shared-characteristics-assignment-process.component.html',
  imports: [HistogramComponent, ReactiveFormsModule],
})
export class IdentifySharedCharacteristicsAssignmentProcessComponent
  implements
    AssignmentProcessProps<
      IdentifySharedCharacteristicsAssignmentConfiguration,
      IdentifySharedCharacteristicsAssignmentCompletionData
    >,
    OnDestroy
{
  @Input()
  config!: IdentifySharedCharacteristicsAssignmentConfiguration | undefined

  private _completionData?: IdentifySharedCharacteristicsAssignmentCompletionData

  get completionData():
    | IdentifySharedCharacteristicsAssignmentCompletionData
    | undefined {
    return this._completionData
  }

  @Input()
  set completionData(
    value: IdentifySharedCharacteristicsAssignmentCompletionData,
  ) {
    this._completionData = value
    this.selectedDatasetsFormControls.setValue(
      Array.from({ length: 4 }, (_, index) =>
        value.selectedDatasets.includes(index),
      ),
    )
  }

  @Output()
  updateCompletionData = new EventEmitter<
    Partial<IdentifySharedCharacteristicsAssignmentCompletionData>
  >()

  @Output()
  createInteractionLog = new EventEmitter<unknown>()

  subscriptions: Subscription[] = []

  originalIndexMap = [0, 1, 2, 3]
  shuffledIndexMap = shuffle(this.originalIndexMap)

  selectedDatasetsFormControls = this.formBuilder.array(
    Array.from({ length: 4 }, () => this.formBuilder.control(false)),
  )
  selectedDatasetIndexes$ = this.selectedDatasetsFormControls.valueChanges.pipe(
    distinctUntilChanged((a, b) => isEqual(a, b)),
    map((bools) => bools.flatMap((bool, index) => (bool ? [index] : []))),
  )

  constructor(private readonly formBuilder: FormBuilder) {
    this.subscriptions.push(
      this.selectedDatasetIndexes$.subscribe((selectedDatasetIndexes) => {
        this.updateCompletionData.emit({
          selectedDatasets: selectedDatasetIndexes,
        })
        this.createInteractionLog.emit({
          action: 'change-selection',
          selectedDatasets: selectedDatasetIndexes,
        })
      }),
    )
  }

  histogramMouseEvent(
    event: {
      action: 'histogram-hover' | 'histogram-click'
      targets: { datasetLabel: string | undefined; value: string }[]
    },
    originalIndex: number,
  ) {
    this.createInteractionLog.emit({
      ...event,
      datasetIndex: originalIndex,
    })
  }

  submit() {
    this.updateCompletionData.emit({
      progress: 1,
    })
  }

  get datasets() {
    const originals = this.config?.datasets.map(({ data }) => data) ?? [
      [],
      [],
      [],
      [],
    ]

    const indexMap = this.config?.randomizeDatasetOrder
      ? this.shuffledIndexMap
      : this.originalIndexMap

    return indexMap.map((index) => ({
      data: originals[index],
      originalIndex: index,
    }))
  }

  get targetPropertyName() {
    return this.config?.targetCharacteristic === 'mean'
      ? 'Durchschnitt'
      : 'Median'
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe())
  }
}
