import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AssignmentProcessProps } from '@stochus/assignment/core/frontend'
import {
  GuessRandomNumberAssignmentCompletionData,
  GuessRandomNumberAssignmentConfiguration,
} from '@stochus/assignments/demos/guess-random-number/shared'

@Component({
  selector: 'stochus-guess-random-number-assignment-process',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guess-random-number-assignment-process.component.html',
})
export class GuessRandomNumberAssignmentProcessComponent
  implements
    AssignmentProcessProps<
      GuessRandomNumberAssignmentConfiguration,
      GuessRandomNumberAssignmentCompletionData
    >
{
  @Input()
  completionData!: GuessRandomNumberAssignmentCompletionData

  @Input()
  config!: GuessRandomNumberAssignmentConfiguration
}
