import { Component, EventEmitter, Input, Output } from '@angular/core'
import {
  IdentifySharedCharacteristicsAssignmentCompletionData,
  IdentifySharedCharacteristicsAssignmentConfiguration,
} from '@stochus/assignments/identify-shared-characteristics/shared'
import { AssignmentProcessProps } from '@stochus/assignments/model/frontend'

@Component({
  standalone: true,
  templateUrl:
    './identify-shared-characteristics-assignment-process.component.html',
})
export class IdentifySharedCharacteristicsAssignmentProcessComponent
  implements
    AssignmentProcessProps<
      IdentifySharedCharacteristicsAssignmentConfiguration,
      IdentifySharedCharacteristicsAssignmentCompletionData
    >
{
  @Input()
  config!: IdentifySharedCharacteristicsAssignmentConfiguration | undefined

  @Input()
  completionData!:
    | IdentifySharedCharacteristicsAssignmentCompletionData
    | undefined

  @Output()
  updateCompletionData = new EventEmitter<
    Partial<IdentifySharedCharacteristicsAssignmentCompletionData>
  >()

  @Output()
  createInteractionLog = new EventEmitter<unknown>()
}
