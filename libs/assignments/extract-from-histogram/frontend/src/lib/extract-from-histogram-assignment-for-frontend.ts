import { FormControl, ValidatorFn, Validators } from '@angular/forms'
import {
  ExtractFromHistogramAssignment,
  ExtractFromHistogramAssignmentCompletionData,
  ExtractFromHistogramAssignmentConfiguration,
} from '@stochus/assignments/extract-from-histogram-assignment/shared'
import { AssignmentForFrontend } from '@stochus/assignments/model/frontend'
import { ExtractFromHistogramAssignmentProcessComponent } from './assignment-process/extract-from-histogram-assignment-process.component'
import { ExtractFromHistogramConfigFormComponent } from './config-form/extract-from-histogram-config-form.component'
import { ExtractFromHistogramAssignmentFeedbackComponent } from './feedback/extract-from-histogram-assignment-feedback.component'

export const ExtractFromHistogramAssignmentForFrontend: AssignmentForFrontend<
  ExtractFromHistogramAssignmentConfiguration,
  ExtractFromHistogramAssignmentCompletionData
> = {
  ...ExtractFromHistogramAssignment,
  completionProcessComponent: ExtractFromHistogramAssignmentProcessComponent,
  configurationInputFormComponent: ExtractFromHistogramConfigFormComponent,
  feedbackComponent: ExtractFromHistogramAssignmentFeedbackComponent,
  generateConfigFormControl: (fb, { targetProperty, data }) =>
    fb.group({
      targetProperty: [targetProperty, [Validators.required]],
      data: [
        data,
        [
          Validators.required,
          ((formControl: FormControl<unknown>) => {
            const value = formControl.value

            if (!Array.isArray(value)) {
              return { invalidData: true }
            }

            if (value.length < 1) {
              return { invalidData: true }
            }

            if (
              value.some(
                (v) =>
                  typeof v !== 'number' ||
                  isNaN(v) ||
                  !isFinite(v) ||
                  Math.floor(v) !== v,
              )
            ) {
              return { invalidData: true }
            }

            return null
          }) as ValidatorFn,
        ],
      ],
    }),
}
