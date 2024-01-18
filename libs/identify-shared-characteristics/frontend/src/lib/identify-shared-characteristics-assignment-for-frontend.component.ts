import { ValidatorFn, Validators } from '@angular/forms'
import {
  IdentifySharedCharacteristicsAssignment,
  IdentifySharedCharacteristicsAssignmentCompletionData,
  IdentifySharedCharacteristicsAssignmentConfiguration,
} from '@stochus/assignments/identify-shared-characteristics/shared'
import { calculateMean, calculateMedian } from '@stochus/core/shared'
import { AssignmentForFrontend } from '@stochus/assignments/model/frontend'
import { IdentifySharedCharacteristicsAssignmentProcessComponent } from './assignment-process/identify-shared-characteristics-assignment-process.component'
import { IdentifySharedCharacteristicsConfigFormComponent } from './config-form/identify-shared-characteristics-config-form.component'
import { IdentifySharedCharacteristicsFeedbackComponent } from './feedback/identify-shared-characteristics-feedback.component'

export const IdentifySharedCharacteristicsAssignmentForFrontend: AssignmentForFrontend<
  IdentifySharedCharacteristicsAssignmentConfiguration,
  IdentifySharedCharacteristicsAssignmentCompletionData
> = {
  ...IdentifySharedCharacteristicsAssignment,
  completionProcessComponent:
    IdentifySharedCharacteristicsAssignmentProcessComponent,
  configurationInputFormComponent:
    IdentifySharedCharacteristicsConfigFormComponent,
  feedbackComponent: IdentifySharedCharacteristicsFeedbackComponent,
  generateConfigFormControl: (
    fb,
    { targetCharacteristic, datasets, randomizeDatasetOrder },
  ) => {
    return fb.group(
      {
        targetCharacteristic: [
          targetCharacteristic,
          [Validators.required, Validators.pattern(/^(mean)|(median)$/)],
        ],
        datasets: [
          datasets,
          [
            Validators.required,
            ((control) => {
              const value = control.value
              if (Array.isArray(value) && value.length === 4) {
                return null
              }

              return { invalidDatasets: true }
            }) as ValidatorFn,
          ],
        ],
        randomizeDatasetOrder: [randomizeDatasetOrder, [Validators.required]],
      },
      {
        validators: [
          ((control) => {
            const value: IdentifySharedCharacteristicsAssignmentConfiguration =
              control.value
            const targetComputer =
              value.targetCharacteristic === 'mean'
                ? calculateMean
                : calculateMedian
            const targetValues = value.datasets.map(({ data }) =>
              targetComputer(data),
            )

            // count frequencies of target values
            const frequencies = new Map<number, number>()
            for (const targetValue of targetValues) {
              const frequency = frequencies.get(targetValue) ?? 0
              frequencies.set(targetValue, frequency + 1)
            }
            const numberOfNonUniqueValues = [...frequencies.values()].filter(
              (frequency) => frequency > 1,
            ).length

            if (numberOfNonUniqueValues === 0) {
              return { noSharedValues: true }
            } else if (numberOfNonUniqueValues > 1) {
              return { tooManySharedValues: true }
            }

            return null
          }) as ValidatorFn,
        ],
      },
    )
  },
}
