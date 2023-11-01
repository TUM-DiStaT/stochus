import { NgModule } from '@angular/core'
import { ToastService } from './toast.service'
import { ToastServiceMock } from './toast.service.mock'

@NgModule({
  providers: [
    {
      provide: ToastService,
      useClass: ToastServiceMock,
    },
  ],
})
export class ToastTestingModule {}
