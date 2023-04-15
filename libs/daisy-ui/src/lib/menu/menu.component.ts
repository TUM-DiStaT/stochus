import { Component, HostBinding, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import * as classNames from 'classnames'

@Component({
  // Prefix is applied to attribute here instead of
  // tag name
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ul[daisyMenu], ol[daisyMenu]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  @Input()
  class?: string

  @Input()
  horizontal: boolean | '' = false

  @HostBinding('class')
  get classes() {
    return classNames(
      'menu',
      {
        horizontal: this.horizontal !== false,
      },
      this.class,
    )
  }
}
