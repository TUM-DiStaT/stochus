import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import {
  DetermineDiceFairnessAssignmentCompletionData,
  DetermineDiceFairnessAssignmentConfiguration,
} from '@stochus/assignments/determine-dice-fairness/shared'
import { AssignmentProcessProps } from '@stochus/assignments/model/frontend'

@Component({
  selector: 'lib-determine-dice-fairness-assignment-process',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './determine-dice-fairness-assignment-process.component.html',
})
export class DetermineDiceFairnessAssignmentProcessComponent
  implements
    AssignmentProcessProps<
      DetermineDiceFairnessAssignmentConfiguration,
      DetermineDiceFairnessAssignmentCompletionData
    >
{
  @Input()
  completionData!: DetermineDiceFairnessAssignmentCompletionData
  @Input()
  config!: DetermineDiceFairnessAssignmentConfiguration
  @Output()
  createInteractionLog = new EventEmitter<unknown>()
  @Output()
  updateCompletionData = new EventEmitter<
    Partial<DetermineDiceFairnessAssignmentCompletionData>
  >()
}
