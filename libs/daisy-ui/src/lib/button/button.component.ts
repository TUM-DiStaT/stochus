import { Component, HostBinding, Input } from '@angular/core'
import * as classNames from 'classnames'

export enum ButtonColor {
  PRIMARY = 'btn-primary',
  SECONDARY = 'btn-secondary',
  ACCENT = 'btn-accent',
  INFO = 'btn-info',
  SUCCESS = 'btn-success',
  WARNING = 'btn-warning',
  ERROR = 'btn-error',
}

export enum ButtonStyle {
  GHOST = 'btn-ghost',
  LINK = 'btn-link',
  OUTLINE = 'btn-outline',
}

export enum ButtonSize {
  LG = 'btn-lg',
  MD = 'btn-md',
  SM = 'btn-sm',
  XS = 'btn-xs',
}

export enum ButtonDimension {
  CIRCLE = 'btn-circle',
  SQUARE = 'btn-square',
}

export enum ButtonWidth {
  WIDE = 'btn-wide',
  BLOCK = 'btn-block',
}

@Component({
  // Prefix is applied to attribute here instead of
  // tag name
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[daisyButton], a[daisyButton]',
  standalone: true,
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input()
  color?: ButtonColor

  @Input()
  style?: ButtonStyle

  @Input()
  size?: ButtonSize

  @Input()
  dimension?: ButtonDimension

  @Input()
  width?: ButtonWidth

  @Input()
  disabled: boolean | '' = false

  @Input()
  loading: boolean | '' = false

  @Input()
  @HostBinding('attr.role')
  role: 'button' | 'link' = 'button'

  @HostBinding('class')
  get computedClassnames() {
    return classNames(
      'btn',
      this.color,
      this.style,
      this.size,
      this.dimension,
      this.width,
      {
        // explicit !== false checks rule out '', which is the value set by
        // shorthand use, e.g. <button daisyButton loading>
        'btn-disabled': this.disabled !== false,
        loading: this.loading !== false,
      },
    )
  }
}
