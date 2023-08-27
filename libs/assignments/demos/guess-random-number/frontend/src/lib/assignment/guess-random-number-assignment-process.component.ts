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

  input = new FormControl<number | null>(null)

  guess() {
    const value = parseInt(this.input.value?.toString() ?? '')
    if (value === null || isNaN(value)) {
      return
    }

    this.input.setValue(null)

    this.completionData?.guesses.push(value)
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
