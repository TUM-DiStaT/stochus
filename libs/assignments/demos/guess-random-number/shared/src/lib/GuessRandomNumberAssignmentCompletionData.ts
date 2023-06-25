import { IsArray } from 'class-validator'
import {
  BaseCompletionData,
  emptyBaseCompletionData,
} from '@stochus/assignments/model/shared'
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
