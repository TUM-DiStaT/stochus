import {
  BaseCompletionData,
  emptyBaseCompletionData,
} from '@stochus/assignment/core/shared'
import { IsArray } from 'class-validator'
import { plainToInstance } from '@stochus/core/shared'

export class GuessRandomNumberAssignmentCompletionData extends BaseCompletionData {
  @IsArray()
  guesses!: number[]
}

export const initialGuessNumberAssignmentCompletionData = plainToInstance(
  GuessRandomNumberAssignmentCompletionData,
  {
    ...emptyBaseCompletionData,
    guesses: [],
  } satisfies GuessRandomNumberAssignmentCompletionData,
)
