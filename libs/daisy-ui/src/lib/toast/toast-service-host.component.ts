import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { AlertComponent } from '../alert/alert.component'
import { StandardToastAlertComponent } from './standard-toast-alert/standard-toast-alert.component'
import { ToastComponent } from './toast.component'
import { ToastService } from './toast.service'

@Component({
  selector: 'daisy-toast-service-host',
  standalone: true,
  imports: [
    CommonModule,
    ToastComponent,
    AlertComponent,
    StandardToastAlertComponent,
  ],
  templateUrl: './toast-service-host.component.html',
})
export class ToastServiceHostComponent {
  @Input()
  class?: string

  constructor(readonly toastService: ToastService) {
    this.toastService.onHostReady()
  }
}
