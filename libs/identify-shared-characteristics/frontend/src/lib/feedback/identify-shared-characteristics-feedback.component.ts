import { Component, Input } from '@angular/core'
import {
  IdentifySharedCharacteristicsAssignmentCompletionData,
  IdentifySharedCharacteristicsAssignmentConfiguration,
} from '@stochus/assignments/identify-shared-characteristics/shared'
import { AssignmentFeedbackProps } from '@stochus/assignments/model/frontend'

@Component({
  standalone: true,
  templateUrl: './identify-shared-characteristics-feedback.component.html',
})
export class IdentifySharedCharacteristicsFeedbackComponent
  implements
    AssignmentFeedbackProps<
      IdentifySharedCharacteristicsAssignmentConfiguration,
      IdentifySharedCharacteristicsAssignmentCompletionData
    >
{
  @Input()
  config!: IdentifySharedCharacteristicsAssignmentConfiguration

  @Input()
  completionData!: IdentifySharedCharacteristicsAssignmentCompletionData
}
