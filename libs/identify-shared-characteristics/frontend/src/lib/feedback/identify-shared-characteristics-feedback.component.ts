import { Component, Input } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import {
  IdentifySharedCharacteristicsAssignmentCompletionData,
  IdentifySharedCharacteristicsAssignmentConfiguration,
} from '@stochus/assignments/identify-shared-characteristics/shared'
import { calculateMean, calculateMedian } from '@stochus/core/shared'
import { AssignmentFeedbackProps } from '@stochus/assignments/model/frontend'
import { HistogramComponent } from '@stochus/core/frontend'

@Component({
  standalone: true,
  templateUrl: './identify-shared-characteristics-feedback.component.html',
  imports: [HistogramComponent, ReactiveFormsModule],
})
export class IdentifySharedCharacteristicsFeedbackComponent
  implements
    AssignmentFeedbackProps<
      IdentifySharedCharacteristicsAssignmentConfiguration,
      IdentifySharedCharacteristicsAssignmentCompletionData
    >
{
  @Input()
  config!: IdentifySharedCharacteristicsAssignmentConfiguration

  @Input()
  completionData!: IdentifySharedCharacteristicsAssignmentCompletionData

  get datasets() {
    const datasets = this.config?.datasets.map(({ data }) => data) ?? [
      [],
      [],
      [],
      [],
    ]

    const targetComputer =
      this.config?.targetCharacteristic === 'mean'
        ? calculateMean
        : calculateMedian
    const targetValues = datasets.map(targetComputer)
    const sharedValue = targetValues.find(
      (value, index) => targetValues.indexOf(value) !== index,
    )

    return datasets.map((dataset, index) => {
      const selected = this.completionData.selectedDatasets.includes(index)
      return {
        selected,
        wasCorrect: selected === (targetValues[index] === sharedValue),
        data: dataset,
      }
    })
  }

  get targetPropertyName() {
    return this.config?.targetCharacteristic === 'mean'
      ? 'Durchschnitt'
      : 'Median'
  }
}
