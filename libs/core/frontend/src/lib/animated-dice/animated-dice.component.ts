import { Component, EventEmitter, Input, Output } from '@angular/core'
import { random } from 'lodash'
import { BehaviorSubject } from 'rxjs'
import { DieComponent } from '../die/die.component'

@Component({
  standalone: true,
  selector: 'stochus-animated-dice',
  templateUrl: './animated-dice.component.html',
  imports: [DieComponent],
})
export class AnimatedDiceComponent {
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

  @Output()
  roll = new EventEmitter<number[]>()

  get count() {
    return this.values.length
  }

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

  get diceSize() {
    return 100 / Math.log(0.6 * (this.values.length + 1))
  }
}
