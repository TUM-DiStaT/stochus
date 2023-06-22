import { ClassConstructor } from 'class-transformer'
import { IsNumber, Max, Min } from 'class-validator'
import { plainToInstance } from '@stochus/core/shared'

export class BaseCompletionData {
  /**
   * Progress from 0 to 1, 0 meaning not started, 1 meaning completed
   */
  @IsNumber()
  @Min(0)
  @Max(1)
  progress!: number
}

export const emptyBaseCompletionData = plainToInstance(BaseCompletionData, {
  progress: 0,
} satisfies BaseCompletionData)

export type BaseAssignment<
  ConfigurationType = unknown,
  CompletionDataType extends BaseCompletionData = BaseCompletionData,
> = {
  id: string
  name: string
  description: string
  /**
   * Used to be able to deal with updates in assignments after they
   * have already been completed. This version should be saved with
   * every db entry (completions, logs, etc) to prepare for backwards
   * compatibility issues.
   */
  version: number

  configurationClass: ClassConstructor<ConfigurationType>
  completionDataClass: ClassConstructor<CompletionDataType>
  getInitialCompletionData: () => CompletionDataType
}
