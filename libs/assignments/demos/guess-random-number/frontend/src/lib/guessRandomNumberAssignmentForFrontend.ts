import {
  GuessRandomNumberAssignment,
  GuessRandomNumberAssignmentCompletionData,
  GuessRandomNumberAssignmentConfiguration,
} from '@stochus/assignments/demos/guess-random-number/shared'
import { AssignmentForFrontend } from '@stochus/assignments/model/frontend'
import { GuessRandomNumberAssignmentProcessComponent } from './assignment/guess-random-number-assignment-process.component'
import { GuessRandomNumberConfigFormComponent } from './config-form/guess-random-number-config-form.component'
import { GuessRandomNumberAssignmentFeedbackComponent } from './guess-random-number-assignment-feedback/guess-random-number-assignment-feedback.component'

export const GuessRandomNumberAssignmentForFrontend: AssignmentForFrontend<
  GuessRandomNumberAssignmentConfiguration,
  GuessRandomNumberAssignmentCompletionData
> = {
  ...GuessRandomNumberAssignment,
  completionProcessComponent: GuessRandomNumberAssignmentProcessComponent,
  configurationInputFormComponent: GuessRandomNumberConfigFormComponent,
  feedbackComponent: GuessRandomNumberAssignmentFeedbackComponent,
}
