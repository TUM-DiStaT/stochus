import { ComponentFixture, TestBed } from '@angular/core/testing'
import { StandardToastAlertComponent } from './standard-toast-alert.component'

describe('StandardToastAlertComponent', () => {
  let component: StandardToastAlertComponent
  let fixture: ComponentFixture<StandardToastAlertComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardToastAlertComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(StandardToastAlertComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
