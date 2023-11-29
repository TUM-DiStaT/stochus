import { CommonModule } from '@angular/common'
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  pairwise,
} from 'rxjs'
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
    >,
    OnDestroy
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

  deletions$ = this.input.valueChanges.pipe(
    pairwise(),
    filter(
      ([last, curr]) =>
        (last?.toString().length ?? 0) >= (curr?.toString().length ?? 0),
    ),
    map(([old, curr]) => ({
      action: 'deletion' as const,
      old,
      curr,
    })),
  )
  enteredValues$ = this.input.valueChanges.pipe(
    debounceTime(500),
    map((value) => ({
      action: 'enteredValue' as const,
      value,
    })),
  )
  guesses$ = new Subject<{
    action: 'guess'
    value: number
  }>()

  @Output()
  createInteractionLog = new EventEmitter()
  createInteractionLogSubscription = merge(
    this.deletions$,
    this.enteredValues$,
    this.guesses$,
  )
    .pipe(
      distinctUntilChanged(
        (lastEvent, currEvent) =>
          // Ignore enteredValue if the last event was the corresponding deletion
          lastEvent.action === 'deletion' &&
          currEvent.action === 'enteredValue' &&
          lastEvent.curr === currEvent.value,
      ),
    )
    .subscribe((v) => this.createInteractionLog.next(v))

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
    this.guesses$.next({
      action: 'guess',
      value,
    })
  }

  ngOnDestroy() {
    this.createInteractionLogSubscription.unsubscribe()
  }
}
