import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import {
  ExtractFromHistogramAssignmentCompletionData,
  ExtractFromHistogramAssignmentConfiguration,
} from '@stochus/assignments/extract-from-histogram-assignment/shared'
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
  standalone: true,
  imports: [CommonModule],
  templateUrl: './extract-from-histogram-assignment-feedback.component.html',
})
export class ExtractFromHistogramAssignmentFeedbackComponent
  implements
    AssignmentFeedbackProps<
      ExtractFromHistogramAssignmentConfiguration,
      ExtractFromHistogramAssignmentCompletionData
    >
{
  @Input()
  completionData?: ExtractFromHistogramAssignmentCompletionData

  @Input()
  config?: ExtractFromHistogramAssignmentConfiguration

  // get stats() {
  //   const actualNumberOfGuesses = this.completionData?.guesses.length
  //   const optimalGuesses = getOptimalGuessesForResult(this.config?.result)
  //   const optimalNumberOfGuesses = optimalGuesses.length
  //   return {
  //     actualNumberOfGuesses,
  //     optimalGuesses,
  //     optimalNumberOfGuesses,
  //   }
  // }
}
