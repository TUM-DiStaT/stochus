import { Injectable } from '@angular/core'
import { ToastService } from './toast.service'

@Injectable({ providedIn: 'root' })
export class ToastServiceMock extends ToastService {
  override _hostIsReady = true
}
