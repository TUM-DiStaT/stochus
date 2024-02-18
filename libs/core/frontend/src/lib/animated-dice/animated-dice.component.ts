import { Component, Input } from '@angular/core'
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
  set count(count: number) {
    this.values = Array.from({ length: count }, () => new BehaviorSubject(1))
  }

  get count() {
    return this.values.length
  }

  values = Array.from({ length: 10 }, () => new BehaviorSubject(1))

  canRoll = true

  roll() {
    for (const value of this.values) {
      value.next(random(1, 6))
    }

    this.canRoll = false
    setTimeout(() => {
      this.canRoll = true
    }, 1_200)
  }

  get diceSize() {
    return 100 / Math.log(0.6 * (this.values.length + 1))
  }
}
