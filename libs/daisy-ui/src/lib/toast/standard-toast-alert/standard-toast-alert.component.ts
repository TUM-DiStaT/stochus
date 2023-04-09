import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AlertComponent, AlertType } from '../../alert/alert.component'
import { ToastOptions } from '../toast'
import { interval, map } from 'rxjs'
import {
  ButtonComponent,
  ButtonDimension,
  ButtonSize,
  ButtonStyle,
} from '../../button/button.component'

export type StandardAlertToast = {
  type: AlertType
  content: string
  options: ToastOptions
}

@Component({
  selector: 'daisy-standard-toast-alert',
  standalone: true,
  imports: [CommonModule, AlertComponent, ButtonComponent],
  templateUrl: './standard-toast-alert.component.html',
})
export class StandardToastAlertComponent {
  private static interval = interval(30)

  @Input()
  toast!: StandardAlertToast

  @Output()
  manualClose = new EventEmitter<StandardAlertToast>()

  hidden = false
  mountTime = Date.now()
  progress$ = StandardToastAlertComponent.interval.pipe(
    map(() => {
      const passedTime = Date.now() - this.mountTime
      return Math.min(1, passedTime / this.toast.options.duration)
    }),
  )

  protected readonly ButtonSize = ButtonSize
  protected readonly ButtonStyle = ButtonStyle
  protected readonly ButtonDimension = ButtonDimension
}
