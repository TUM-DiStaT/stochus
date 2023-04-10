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
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import {
  heroXMark,
  heroInformationCircle,
  heroCheckCircle,
  heroExclamationTriangle,
  heroXCircle,
} from '@ng-icons/heroicons/outline'

export type StandardAlertToast = {
  type: AlertType
  content: string
  options: ToastOptions
}

@Component({
  selector: 'daisy-standard-toast-alert',
  standalone: true,
  imports: [CommonModule, AlertComponent, ButtonComponent, NgIconComponent],
  providers: [
    provideIcons({
      heroXMark,
      heroInformationCircle,
      heroCheckCircle,
      heroExclamationTriangle,
      heroXCircle,
    }),
  ],
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

  get prefixIcon() {
    return {
      [AlertType.INFO]: { icon: 'heroInformationCircle', label: 'Info:' },
      [AlertType.SUCCESS]: { icon: 'heroCheckCircle', label: 'Erfolg:' },
      [AlertType.WARNING]: {
        icon: 'heroExclamationTriangle',
        label: 'Warnung:',
      },
      [AlertType.ERROR]: { icon: 'heroXCircle', label: 'Fehler:' },
    }[this.toast.type]
  }

  protected readonly ButtonSize = ButtonSize
  protected readonly ButtonStyle = ButtonStyle
  protected readonly ButtonDimension = ButtonDimension
}
