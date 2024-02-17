import { Expose } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator'
import { random } from 'lodash'
import {
  BaseAssignment,
  BaseCompletionData,
  emptyBaseCompletionData,
} from '@stochus/assignments/model/shared'

export class DetermineDiceFairnessAssignmentConfiguration {
  @Expose()
  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsNumber({}, { each: true })
  proportions!: number[]

  @Expose()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(6, { each: true })
  initialRolls!: number[]

  @Expose()
  @IsNumber()
  @Min(1)
  dicePerRoll!: number
}

export class DetermineDiceFairnessAssignmentCompletionData extends BaseCompletionData {
  @Expose()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  resultFrequencies!: number[]

  @Expose()
  @IsOptional()
  @IsBoolean()
  isFairGuess?: boolean

  @Expose()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Max(5)
  confidence!: number
}

export const DetermineDiceFairnessAssignment: BaseAssignment<
  DetermineDiceFairnessAssignmentConfiguration,
  DetermineDiceFairnessAssignmentCompletionData
> = {
  id: 'DetermineDiceFairnessAssignment',
  name: 'Würfel auf Fairness prüfen',
  version: 0,
  description: 'Prüfe, ob ein Würfel fair ist.',
  getInitialCompletionData:
    (): DetermineDiceFairnessAssignmentCompletionData => ({
      ...emptyBaseCompletionData,
      resultFrequencies: Array.from({ length: 6 }, () => 0),
      confidence: 3,
    }),
  getRandomConfig: (): DetermineDiceFairnessAssignmentConfiguration => {
    const shouldCreateFairConfig = Math.random() > 0.5
    return {
      proportions: Array.from({ length: 6 }, () =>
        shouldCreateFairConfig ? 1 : random(0, 10),
      ),
      dicePerRoll: 4,
      initialRolls: [],
    }
  },
  configurationClass: DetermineDiceFairnessAssignmentConfiguration,
  completionDataClass: DetermineDiceFairnessAssignmentCompletionData,
}
