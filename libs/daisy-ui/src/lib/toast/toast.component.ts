import { CommonModule } from '@angular/common'
import { Component, HostBinding, Input } from '@angular/core'
import * as classNames from 'classnames'

export enum ToastHorizontalAlignment {
  START = 'toast-start',
  CENTER = 'toast-center',
  END = 'toast-end',
}

export enum ToastVerticalAlignment {
  TOP = 'toast-top',
  MIDDLE = 'toast-middle',
  BOTTOM = 'toast-bottom',
}

@Component({
  selector: 'daisy-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  @Input()
  horizontalAlignment: ToastHorizontalAlignment = ToastHorizontalAlignment.END

  @Input()
  verticalAlignment: ToastVerticalAlignment = ToastVerticalAlignment.TOP

  @HostBinding('class')
  get class() {
    return classNames('toast', this.horizontalAlignment, this.verticalAlignment)
  }
}
