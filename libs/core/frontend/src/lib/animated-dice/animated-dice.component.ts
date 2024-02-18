import { Component, OnInit } from '@angular/core'
import { random } from 'lodash'
import { BehaviorSubject } from 'rxjs'
import { DieComponent } from '../die/die.component'

@Component({
  standalone: true,
  selector: 'stochus-animated-dice',
  templateUrl: './animated-dice.component.html',
  imports: [DieComponent],
})
export class AnimatedDiceComponent implements OnInit {
  values = Array.from({ length: 10 }, () => new BehaviorSubject(1))

  roll() {
    for (const value of this.values) {
      value.next(random(1, 6))
    }
  }

  ngOnInit() {
    this.roll()
  }
}
