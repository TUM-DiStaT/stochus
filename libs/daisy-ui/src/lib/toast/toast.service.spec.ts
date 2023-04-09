import { TestBed } from '@angular/core/testing'
import { ToastService } from './toast.service'
import { Component } from '@angular/core'
import { ToastServiceHostComponent } from './toast-service-host.component'

@Component({
  selector: 'daisy-test-without-toast-host',
  template: ` <div>Foo</div>`,
  standalone: true,
})
class WithoutHostComponent {}

@Component({
  selector: 'daisy-test-with-toast-host',
  template: ` <div>
    Foo
    <daisy-toast-service-host></daisy-toast-service-host>
  </div>`,
  standalone: true,
  imports: [ToastServiceHostComponent],
})
class WithHostComponent {}

describe('ToastService', () => {
  describe('with individual testbed', () => {
    it('should throw an error when a toast is created without the host having been mounted', async () => {
      // given
      await TestBed.configureTestingModule({
        imports: [WithoutHostComponent],
      }).compileComponents()
      const fixture = TestBed.createComponent(WithoutHostComponent)
      fixture.detectChanges()
      const service = TestBed.inject(ToastService)

      // then
      expect(() => service.info('Something')).toThrowError()
    })

    it('should simply create toast when host exists', async () => {
      // given
      await TestBed.configureTestingModule({
        imports: [WithHostComponent],
      }).compileComponents()
      const fixture = TestBed.createComponent(WithHostComponent)
      fixture.detectChanges()
      const service = TestBed.inject(ToastService)

      // then
      expect(() => service.info('Something')).not.toThrowError()
    })
  })

  describe('with shared testbed', () => {
    let service: ToastService

    beforeEach(() => {
      TestBed.configureTestingModule({})
      service = TestBed.inject(ToastService)
    })

    it('should mount service', () => {
      expect(service).toBeTruthy()
    })
  })
})
