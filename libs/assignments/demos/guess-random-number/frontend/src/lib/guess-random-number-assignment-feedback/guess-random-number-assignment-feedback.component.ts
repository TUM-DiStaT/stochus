import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import {
  GuessRandomNumberAssignmentCompletionData,
  GuessRandomNumberAssignmentConfiguration,
} from '@stochus/assignments/demos/guess-random-number/shared'
import { AssignmentFeedbackProps } from '@stochus/assignments/model/frontend'

export const getOptimalGuessesForResult = (target?: number) => {
  if (target === undefined) {
    return []
  }

  let [min, max] = [1, 99]
  let currGuess = Math.floor((max - min) / 2) + min
  const guesses = [currGuess]

  let count = 0
  while (currGuess !== target && count < 1_000_000) {
    count++
    if (currGuess > target) {
      max = currGuess - 1
    } else {
      min = currGuess + 1
    }
    currGuess = Math.floor((max - min) / 2) + min
    guesses.push(currGuess)
  }

  return guesses
}

@Component({
  selector: 'stochus-guess-random-number-assignment-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guess-random-number-assignment-feedback.component.html',
})
export class GuessRandomNumberAssignmentFeedbackComponent
  implements
    AssignmentFeedbackProps<
      GuessRandomNumberAssignmentConfiguration,
      GuessRandomNumberAssignmentCompletionData
    >
{
  @Input()
  completionData?: GuessRandomNumberAssignmentCompletionData

  @Input()
  config?: GuessRandomNumberAssignmentConfiguration

  get stats() {
    const actualNumberOfGuesses = this.completionData?.guesses.length
    const optimalGuesses = getOptimalGuessesForResult(this.config?.result)
    const optimalNumberOfGuesses = optimalGuesses.length
    return {
      actualNumberOfGuesses,
      optimalGuesses,
      optimalNumberOfGuesses,
    }
  }
}
