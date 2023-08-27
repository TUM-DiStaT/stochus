import { EventEmitter, Type } from '@angular/core'
import {
  BaseAssignment,
  BaseCompletionData,
} from '@stochus/assignments/model/shared'

export type AssignmentConfigFormProps<ConfigurationType> = {
  submitConfig: EventEmitter<ConfigurationType>
}

export type AssignmentProcessProps<
  ConfigurationType,
  CompletionDataType extends BaseCompletionData,
> = {
  config?: ConfigurationType
  completionData?: CompletionDataType
  updateCompletionData: EventEmitter<Partial<CompletionDataType>>
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
  feedbackComponent: Type<
    AssignmentProcessProps<ConfigurationType, CompletionDataType>
  >
}
