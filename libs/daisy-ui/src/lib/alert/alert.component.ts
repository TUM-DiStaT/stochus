import { CommonModule } from '@angular/common'
import { Component, HostBinding, Input } from '@angular/core'
import * as classNames from 'classnames'

export enum AlertType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

@Component({
  selector: 'daisy-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  @Input()
  type = AlertType.INFO

  @HostBinding('class')
  get className() {
    return classNames('alert shadow-lg', {
      'alert-info': this.type === AlertType.INFO,
      'alert-success': this.type === AlertType.SUCCESS,
      'alert-warning': this.type === AlertType.WARNING,
      'alert-error': this.type === AlertType.ERROR,
    })
  }
}
