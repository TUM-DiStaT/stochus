import {
  ToastHorizontalAlignment,
  ToastVerticalAlignment,
} from './toast.component'

export type ToastOptions = {
  /**
   * Duration (milliseconds) for the toast to stay on screen
   */
  duration: number
  horizontalAlignment: ToastHorizontalAlignment
  verticalAlignment: ToastVerticalAlignment
}
