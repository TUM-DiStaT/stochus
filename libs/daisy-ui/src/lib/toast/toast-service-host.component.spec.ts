import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ToastServiceHostComponent } from './toast-service-host.component'
import { AlertComponent, AlertType } from '../alert/alert.component'
import { ToastService } from './toast.service'
import { DebugElement } from '@angular/core'

jest.useFakeTimers()

describe('ToastServiceHostComponent', () => {
  let component: ToastServiceHostComponent
  let fixture: ComponentFixture<ToastServiceHostComponent>
  let service: ToastService
  let debugElement: DebugElement

  const getAlerts = () =>
    debugElement
      .queryAll((el) => el.name === 'daisy-alert')
      .map((element) => {
        expect(element).toBeTruthy()
        const alertComponent = element.componentInstance
        expect(alertComponent).toBeInstanceOf(AlertComponent)
        return { element, component: alertComponent }
      })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastServiceHostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ToastServiceHostComponent)
    component = fixture.componentInstance
    debugElement = fixture.debugElement
    service = TestBed.inject(ToastService)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should create an info alert with the expected content', () => {
    // given
    const content = 'Test'

    // when
    service.info(content)
    fixture.detectChanges()

    // then
    const alerts = getAlerts()
    expect(alerts).toHaveLength(1)
    const { element: alertElement, component: alertComponent } = alerts[0]

    expect(alertComponent.type).toBe(AlertType.INFO)
    expect(alertElement.nativeElement.textContent).toContain(content)
  })

  it('should create a success alert with the expected content', () => {
    // given
    const content = 'Test'

    // when
    service.success(content)
    fixture.detectChanges()

    // then
    const alerts = getAlerts()
    expect(alerts).toHaveLength(1)
    const { element: alertElement, component: alertComponent } = alerts[0]

    expect(alertComponent.type).toBe(AlertType.SUCCESS)
    expect(alertElement.nativeElement.textContent).toContain(content)
  })

  it('should create a warn alert with the expected content', () => {
    // given
    const content = 'Test'

    // when
    service.warn(content)
    fixture.detectChanges()

    // then
    const alerts = getAlerts()
    expect(alerts).toHaveLength(1)
    const { element: alertElement, component: alertComponent } = alerts[0]

    expect(alertComponent.type).toBe(AlertType.WARNING)
    expect(alertElement.nativeElement.textContent).toContain(content)
  })

  it('should create an error alert with the expected content', () => {
    // given
    const content = 'Test'

    // when
    service.error(content)
    fixture.detectChanges()

    // then
    const alerts = getAlerts()
    expect(alerts).toHaveLength(1)
    const { element: alertElement, component: alertComponent } = alerts[0]

    expect(alertComponent.type).toBe(AlertType.ERROR)
    expect(alertElement.nativeElement.textContent).toContain(content)
  })

  it('should handle an error object correctly', () => {
    // given
    const content = 'Test'
    const error = new Error(content)

    // when
    service.error(error)
    fixture.detectChanges()

    // then
    const alerts = getAlerts()
    expect(alerts).toHaveLength(1)
    const { element: alertElement } = alerts[0]
    expect(alertElement.nativeElement.textContent).toContain(content)
  })

  it("should hide toasts once they've been on screen for long enough", () => {
    // when
    service.info('something')
    fixture.detectChanges()

    expect(getAlerts()).toHaveLength(1)

    jest.advanceTimersByTime(service.defaultOptions.duration)
    fixture.detectChanges()

    expect(getAlerts()).toHaveLength(0)
  })

  it('should close when the close button is pressed', () => {
    // given
    service.error('Something')
    fixture.detectChanges()

    const alertElement = getAlerts()[0].element
    const closeButton: HTMLButtonElement | undefined = alertElement.query(
      (el) => el.name === 'button',
    )?.nativeElement
    expect(closeButton).toBeTruthy()

    // when
    closeButton?.click()
    fixture.detectChanges()

    // then
    expect(getAlerts()).toHaveLength(0)
  })
})
