import { AssignmentForFrontend } from '@stochus/assignment/core/frontend'
import {
  initialGuessNumberAssignmentCompletionData,
  GuessRandomNumberAssignmentCompletionData,
  GuessRandomNumberAssignmentConfiguration,
} from '@stochus/assignments/demos/guess-random-number/shared'
import { GuessRandomNumberAssignmentProcessComponent } from './assignment/guess-random-number-assignment-process.component'
import { GuessRandomNumberConfigFormComponent } from './config-form/guess-random-number-config-form.component'

export const GuessRandomNumberAssignment: AssignmentForFrontend<
  GuessRandomNumberAssignmentConfiguration,
  GuessRandomNumberAssignmentCompletionData
> = {
  id: 'GuessRandomNumberAssignment',
  name: 'Zuffallszahl raten',
  version: 0,
  description:
    'Rate eine Nummer. Nach jedem Versuch siehst du, wie falsch du gelegen hast.',
  getInitialCompletionData: () => initialGuessNumberAssignmentCompletionData,
  configurationClass: GuessRandomNumberAssignmentConfiguration,
  completionDataClass: GuessRandomNumberAssignmentCompletionData,
  completionProcessComponent: GuessRandomNumberAssignmentProcessComponent,
  configurationInputFormComponent: GuessRandomNumberConfigFormComponent,
}