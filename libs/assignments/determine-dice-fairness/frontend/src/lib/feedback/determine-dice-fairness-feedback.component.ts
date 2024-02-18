import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { heroExclamationTriangle } from '@ng-icons/heroicons/outline'
import {
  DetermineDiceFairnessAssignmentCompletionData,
  DetermineDiceFairnessAssignmentConfiguration,
} from '@stochus/assignments/determine-dice-fairness/shared'
import { minimumProbabilityD6IsUnfair } from '@stochus/core/shared'

@Component({
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './determine-dice-fairness-feedback.component.html',
  providers: [provideIcons({ heroExclamationTriangle })],
})
export class DetermineDiceFairnessFeedbackComponent {
  private _config?: DetermineDiceFairnessAssignmentConfiguration
  private _completionData!: DetermineDiceFairnessAssignmentCompletionData
  result?: {
    unfairnessProbabilityInPercent: number
    totalAmountOfThrows: number
    isFair: boolean
    correct: boolean
  }

  get completionData(): DetermineDiceFairnessAssignmentCompletionData {
    return this._completionData
  }

  @Input()
  set completionData(value: DetermineDiceFairnessAssignmentCompletionData) {
    this._completionData = value
    this.computeResult()
  }

  get config(): DetermineDiceFairnessAssignmentConfiguration | undefined {
    return this._config
  }

  @Input()
  set config(value: DetermineDiceFairnessAssignmentConfiguration) {
    this._config = value
    this.computeResult()
  }

  private computeResult() {
    if (!this._config || !this._completionData) {
      return
    }
    const observedFrequencies = this._completionData.resultFrequencies
    const isFair =
      this.config?.proportions.every(
        (p) => p === this.config?.proportions[0],
      ) ?? true

    this.result = {
      isFair,
      correct: isFair === this.completionData.isFairGuess,
      unfairnessProbabilityInPercent:
        Math.round(minimumProbabilityD6IsUnfair(observedFrequencies) * 1000) /
        10,
      totalAmountOfThrows: observedFrequencies.reduce((a, b) => a + b, 0),
    }
  }
}
