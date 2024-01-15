import { Validators } from '@angular/forms'
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
      data: [data, [Validators.required]],
    }),
}
