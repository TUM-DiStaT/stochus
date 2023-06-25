import {
  BaseAssignment,
  BaseCompletionData,
} from '@stochus/assignments/model/shared'
import { EventEmitter, Type } from '@angular/core'

export type AssignmentConfigFormProps<ConfigurationType> = {
  submitConfig: EventEmitter<ConfigurationType>
}

export type AssignmentProcessProps<
  ConfigurationType,
  CompletionDataType extends BaseCompletionData,
> = {
  config: ConfigurationType
  completionData: CompletionDataType
}

export type AssignmentForFrontend<
  ConfigurationType = unknown,
  CompletionDataType extends BaseCompletionData = BaseCompletionData,
> = BaseAssignment<ConfigurationType, CompletionDataType> & {
  configurationInputFormComponent: Type<
    AssignmentConfigFormProps<ConfigurationType>
  >
  completionProcessComponent: Type<
    AssignmentProcessProps<ConfigurationType, CompletionDataType>
  >
}
