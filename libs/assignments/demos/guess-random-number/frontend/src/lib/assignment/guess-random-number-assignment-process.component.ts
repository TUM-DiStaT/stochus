import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import {
  GuessRandomNumberAssignmentCompletionData,
  GuessRandomNumberAssignmentConfiguration,
} from '@stochus/assignments/demos/guess-random-number/shared'
import { AssignmentProcessProps } from '@stochus/assignments/model/frontend'
import { ButtonComponent } from '@stochus/daisy-ui'

@Component({
  selector: 'stochus-guess-random-number-assignment-process',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './guess-random-number-assignment-process.component.html',
})
export class GuessRandomNumberAssignmentProcessComponent
  implements
    AssignmentProcessProps<
      GuessRandomNumberAssignmentConfiguration,
      GuessRandomNumberAssignmentCompletionData
    >
{
  @Output()
  updateCompletionData = new EventEmitter<
    Partial<GuessRandomNumberAssignmentCompletionData>
  >()

  @Input()
  completionData?: GuessRandomNumberAssignmentCompletionData

  @Input()
  config?: GuessRandomNumberAssignmentConfiguration

  @Input()
  completionId?: string

  input = new FormControl<number | null>(null)

  guess() {
    const value = this.input.value
    if (value === null) {
      return
    }

    this.completionData?.guesses.unshift(value)
    const update: Partial<GuessRandomNumberAssignmentCompletionData> = {
      guesses: this.completionData?.guesses,
    }

    if (value === this.config?.result && this.completionData) {
      this.completionData.progress = 1
      update.progress = 1
    }
    this.updateCompletionData.next(update)
  }
}
