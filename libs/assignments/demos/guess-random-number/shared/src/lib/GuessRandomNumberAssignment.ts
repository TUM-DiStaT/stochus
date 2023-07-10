import { BaseAssignment } from '@stochus/assignments/model/shared'
import {
  GuessRandomNumberAssignmentCompletionData,
  initialGuessNumberAssignmentCompletionData,
} from './GuessRandomNumberAssignmentCompletionData'
import { GuessRandomNumberAssignmentConfiguration } from './GuessRandomNumberAssignmentConfiguration'

export const GuessRandomNumberAssignment: BaseAssignment<
  GuessRandomNumberAssignmentConfiguration,
  GuessRandomNumberAssignmentCompletionData
> = {
  id: 'GuessRandomNumberAssignment',
  name: 'Zuffallszahl raten',
  version: 0,
  description:
    'Rate eine Nummer zwischen 1 und 100 (beide inklusive). Nach jedem Versuch siehst du, wie falsch du gelegen hast.',
  getInitialCompletionData: () => initialGuessNumberAssignmentCompletionData,
  getRandomConfig: () => ({
    result: Math.floor(Math.random() * 100) + 1,
  }),
  configurationClass: GuessRandomNumberAssignmentConfiguration,
  completionDataClass: GuessRandomNumberAssignmentCompletionData,
}
