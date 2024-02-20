import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { random } from 'lodash'
import { BehaviorSubject, combineLatest } from 'rxjs'
import { DieComponent } from '../die/die.component'

@Component({
  standalone: true,
  selector: 'stochus-animated-dice',
  templateUrl: './animated-dice.component.html',
  imports: [DieComponent],
})
export class AnimatedDiceComponent implements AfterViewInit {
  @Input()
  amountPreviouslyRolled = 0
  @Input()
  initialRolls: number[] = []
  @Input()
  proportions = Array.from({ length: 6 }, () => 1)

  @Input()
  set count(count: number) {
    this.values = Array.from({ length: count }, () => new BehaviorSubject(1))
  }

  get count() {
    return this.values.length
  }

  @Output()
  roll = new EventEmitter<number[]>()

  @ViewChildren('container')
  diceContainerRef?: QueryList<ElementRef<HTMLDivElement>>

  @ViewChildren('button')
  buttonRef?: QueryList<ElementRef<HTMLButtonElement>>

  values = Array.from({ length: 10 }, () => new BehaviorSubject(1))

  canRoll = true

  doRoll() {
    const nextRolls = this.getNextRolls()
    for (let i = 0; i < this.values.length; i++) {
      const value = this.values[i]
      value.next(nextRolls[i])
    }

    this.canRoll = false
    setTimeout(() => {
      this.canRoll = true
      this.roll.emit(nextRolls)
    }, 1_200)
  }

  getNextRolls() {
    const predeterminedRolls = this.initialRolls.slice(
      this.amountPreviouslyRolled,
      this.amountPreviouslyRolled + this.count,
    )

    if (predeterminedRolls.length === this.count) {
      return predeterminedRolls
    }

    const proportionSum = this.proportions.reduce((acc, curr) => acc + curr, 0)

    const randomRolls = Array.from(
      { length: this.count - predeterminedRolls.length },
      () => {
        let valWithinProportionRange = random(1, proportionSum)

        // iterate over proportions finding the first one that is greater than the random value
        for (let i = 0; i < this.proportions.length; i++) {
          if (valWithinProportionRange <= this.proportions[i]) {
            return i + 1
          } else {
            valWithinProportionRange -= this.proportions[i]
          }
        }

        return 6
      },
    )

    return [...predeterminedRolls, ...randomRolls]
  }

  diceSize = 0

  reComputeDiceSize() {
    const button = this.buttonRef?.first?.nativeElement
    const diceContainer = this.diceContainerRef?.first?.nativeElement

    if (!button || !diceContainer || this.count < 1) {
      this.diceSize = 50
      return
    }

    const availableWidth = diceContainer.offsetWidth
    const availableHeight = diceContainer.offsetHeight - button.offsetHeight

    this.diceSize = Math.floor(
      (Math.sqrt(availableWidth) *
        Math.sqrt(64 * this.count * availableHeight + availableWidth) -
        availableWidth) /
        (16 * this.count),
    )
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => this.reComputeDiceSize())
    if (this.buttonRef && this.diceContainerRef) {
      combineLatest([
        this.buttonRef.changes,
        this.diceContainerRef.changes,
      ]).subscribe(() => this.reComputeDiceSize())
    }
  }
}
