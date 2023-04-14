import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import * as classNames from 'classnames'
import { ButtonComponent, ButtonStyle } from '../button/button.component'

export enum DropdownVerticalDirection {
  TOP = 'dropdown-top',
  BOTTOM = 'dropdown-bottom',
}

export enum DropdownHorizontalDirection {
  LEFT = 'dropdown-left',
  RIGHT = 'dropdown-right',
}

@Component({
  selector: 'daisy-dropdown',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './dropdown.component.html',
})
export class DropdownComponent {
  @Input()
  alignEnd: boolean | '' = false

  @Input()
  showOnHover: boolean | '' = false

  @Input()
  forceOpen: boolean | '' = false

  @Input()
  verticalDirection?: DropdownVerticalDirection

  @Input()
  horizontalDirection?: DropdownHorizontalDirection

  get labelClassnames() {
    return classNames(
      'dropdown',
      {
        // strict `!== false` checks rule out `''`, which is set in shorthand
        // e.g. <dropdown alignEnd>
        'dropdown-end': this.alignEnd !== false,
        'dropdown-hover': this.showOnHover !== false,
        'dropdown-open': this.forceOpen !== false,
      },
      this.verticalDirection,
      this.horizontalDirection,
    )
  }

  protected readonly ButtonStyle = ButtonStyle
}
