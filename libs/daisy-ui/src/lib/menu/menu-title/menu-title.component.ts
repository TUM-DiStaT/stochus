import { CommonModule } from '@angular/common'
import { Component, HostBinding, Input } from '@angular/core'
import * as classNames from 'classnames'

@Component({
  // Prefix is applied to attribute here instead of
  // tag name
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'li[daisyMenuTitle]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-title.component.html',
})
export class MenuTitleComponent {
  @Input()
  class?: string

  @HostBinding('class')
  get classes() {
    return classNames(this.class, 'menu-title')
  }
}
