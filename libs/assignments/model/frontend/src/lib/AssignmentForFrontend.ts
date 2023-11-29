import { EventEmitter, Type } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { FormModel } from 'ngx-mf'
import {
  BaseAssignment,
  BaseCompletionData,
} from '@stochus/assignments/model/shared'

export type AssignmentConfigFormProps<ConfigurationType> = {
  formControl: FormModel<ConfigurationType>
}

export type AssignmentProcessProps<
  ConfigurationType,
  CompletionDataType extends BaseCompletionData,
> = {
  config?: ConfigurationType
  completionData?: CompletionDataType
  updateCompletionData: EventEmitter<Partial<CompletionDataType>>
  createInteractionLog: EventEmitter<unknown>
}

export type AssignmentFeedbackProps<
  ConfigurationType,
  CompletionDataType extends BaseCompletionData,
> = {
  config?: ConfigurationType
  completionData?: CompletionDataType
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
    AssignmentFeedbackProps<ConfigurationType, CompletionDataType>
  >
  generateConfigFormControl: (
    fb: FormBuilder,
    prefillValues: ConfigurationType,
  ) => FormModel<ConfigurationType>
}
