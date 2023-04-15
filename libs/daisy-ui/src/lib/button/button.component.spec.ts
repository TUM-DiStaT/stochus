import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
  ButtonColor,
  ButtonComponent,
  ButtonDimension,
  ButtonSize,
  ButtonStyle,
  ButtonWidth,
} from './button.component'
import { Component } from '@angular/core'

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `<button daisyButton class="test-class"></button>`,
})
class SetClassByParentTestComponent {}

describe('ButtonComponent', () => {
  let component: ButtonComponent
  let fixture: ComponentFixture<ButtonComponent>
  let nativeElement: HTMLElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ButtonComponent)
    component = fixture.componentInstance
    nativeElement = fixture.nativeElement
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should set the disabled class correctly', () => {
    component.disabled = true
    fixture.detectChanges()
    expect(nativeElement.classList).toContain('btn-disabled')

    component.disabled = ''
    fixture.detectChanges()
    expect(nativeElement.classList).toContain('btn-disabled')

    component.disabled = false
    fixture.detectChanges()
    expect(nativeElement.classList).not.toContain('btn-disabled')
  })

  it('should set the loading class correctly', () => {
    component.loading = true
    fixture.detectChanges()
    expect(nativeElement.classList).toContain('loading')

    component.loading = ''
    fixture.detectChanges()
    expect(nativeElement.classList).toContain('loading')

    component.loading = false
    fixture.detectChanges()
    expect(nativeElement.classList).not.toContain('loading')
  })

  it('should set the base .btn class', () => {
    expect(nativeElement.classList).toContain('btn')
  })

  it('should set classes for all other inputs', () => {
    expect(nativeElement.classList).not.toContain(ButtonSize.SM)
    expect(nativeElement.classList).not.toContain(ButtonStyle.GHOST)
    expect(nativeElement.classList).not.toContain(ButtonWidth.WIDE)
    expect(nativeElement.classList).not.toContain(ButtonColor.PRIMARY)
    expect(nativeElement.classList).not.toContain(ButtonDimension.SQUARE)

    component.size = ButtonSize.SM
    component.style = ButtonStyle.GHOST
    component.width = ButtonWidth.WIDE
    component.color = ButtonColor.PRIMARY
    component.dimension = ButtonDimension.SQUARE

    fixture.detectChanges()

    expect(nativeElement.classList).toContain(ButtonSize.SM)
    expect(nativeElement.classList).toContain(ButtonStyle.GHOST)
    expect(nativeElement.classList).toContain(ButtonWidth.WIDE)
    expect(nativeElement.classList).toContain(ButtonColor.PRIMARY)
    expect(nativeElement.classList).toContain(ButtonDimension.SQUARE)
  })

  it('should set the role to button', () => {
    expect(nativeElement.getAttribute('role')).toBe('button')
  })

  it('should allow the role to be overridden to link', () => {
    component.role = 'link'
    fixture.detectChanges()

    expect(nativeElement.getAttribute('role')).toBe('link')
  })

  it('should keep classes that were set by the parent', () => {
    // when
    const fixture = TestBed.createComponent(SetClassByParentTestComponent)
    const parent: HTMLElement = fixture.nativeElement
    const element = parent?.getElementsByTagName('button')?.[0]
    fixture.detectChanges()

    // then
    expect(element).toBeTruthy()
    expect(element.className).toContain('test-class')
  })
})
