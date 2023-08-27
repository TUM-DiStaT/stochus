import {
  GuessRandomNumberAssignment,
  GuessRandomNumberAssignmentCompletionData,
  GuessRandomNumberAssignmentConfiguration,
} from '@stochus/assignments/demos/guess-random-number/shared'
import { AssignmentForFrontend } from '@stochus/assignments/model/frontend'
import { GuessRandomNumberAssignmentProcessComponent } from './assignment/guess-random-number-assignment-process.component'
import { GuessRandomNumberConfigFormComponent } from './config-form/guess-random-number-config-form.component'

export const GuessRandomNumberAssignmentForFrontend: AssignmentForFrontend<
  GuessRandomNumberAssignmentConfiguration,
  GuessRandomNumberAssignmentCompletionData
> = {
  ...GuessRandomNumberAssignment,
  completionProcessComponent: GuessRandomNumberAssignmentProcessComponent,
  configurationInputFormComponent: GuessRandomNumberConfigFormComponent,
  feedbackComponent: GuessRandomNumberAssignmentProcessComponent,
}
