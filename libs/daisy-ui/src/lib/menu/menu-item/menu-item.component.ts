import { CommonModule } from '@angular/common'
import { Component, HostBinding, Input } from '@angular/core'
import * as classNames from 'classnames'

@Component({
  // Prefix is applied to attribute here instead of
  // tag name
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'li[daisyMenuItem]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-item.component.html',
})
export class MenuItemComponent {
  @Input()
  class?: string

  @Input()
  active: boolean | '' = false

  @Input()
  disabled: boolean | '' = false

  @Input()
  bordered: boolean | '' = false

  @Input()
  hoverBordered: boolean | '' = false

  @HostBinding('class')
  get classes() {
    return classNames(this.class, {
      disabled: this.disabled !== false,
      active: this.active !== false,
      bordered: this.bordered !== false,
      'hover-bordered': this.hoverBordered !== false,
    })
  }
}
