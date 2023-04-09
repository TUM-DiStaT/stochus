import { Injectable, Type } from '@angular/core'
import {
  ToastHorizontalAlignment,
  ToastVerticalAlignment,
} from './toast.component'
import { BehaviorSubject } from 'rxjs'
import { AlertType } from '../alert/alert.component'
import { StandardAlertToast } from './standard-toast-alert/standard-toast-alert.component'
import { ToastOptions } from './toast'

type CustomContentToast = {
  component: Type<unknown>
  options: ToastOptions
}

type Toast = StandardAlertToast | CustomContentToast

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  defaultOptions: ToastOptions = {
    duration: 5_000,
    horizontalAlignment: ToastHorizontalAlignment.END,
    verticalAlignment: ToastVerticalAlignment.TOP,
  }

  private _toasts = new BehaviorSubject<Toast[]>([])
  readonly toasts$ = this._toasts.asObservable()

  info(content: string) {
    this.newStandardAlert(AlertType.INFO, content)
  }

  success(content: string) {
    this.newStandardAlert(AlertType.SUCCESS, content)
  }

  warn(content: string) {
    this.newStandardAlert(AlertType.WARNING, content)
  }

  error(input: string | Error) {
    this.newStandardAlert(AlertType.ERROR, input.toString())
  }

  isStandardAlertToast(toast: Toast): toast is StandardAlertToast {
    return Boolean((toast as StandardAlertToast).type)
  }

  asStandardAlertToast(toast: Toast): StandardAlertToast {
    if (this.isStandardAlertToast(toast)) {
      return toast
    }

    throw new TypeError('Unsuccessfully tried to cast a non-standard toast')
  }

  private newStandardAlert(type: AlertType, content: string) {
    const newToast: StandardAlertToast = {
      type,
      content,
      options: {
        ...this.defaultOptions,
      },
    }
    this._toasts.next([newToast, ...this._toasts.value])

    setTimeout(() => {
      this.close(newToast)
    }, this.defaultOptions.duration)
  }

  close(toast: Toast) {
    this._toasts.next(this._toasts.value.filter((curr) => curr !== toast))
  }
}
