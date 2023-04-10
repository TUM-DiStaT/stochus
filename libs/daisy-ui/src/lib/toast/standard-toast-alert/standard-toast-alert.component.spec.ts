import { ComponentFixture, TestBed } from '@angular/core/testing'
import { StandardToastAlertComponent } from './standard-toast-alert.component'
import { AlertType } from '../../alert/alert.component'
import {
  ToastHorizontalAlignment,
  ToastVerticalAlignment,
} from '../toast.component'

describe('StandardToastAlertComponent', () => {
  let component: StandardToastAlertComponent
  let fixture: ComponentFixture<StandardToastAlertComponent>

  const exampleToast = {
    type: AlertType.ERROR,
    options: {
      duration: 5_000,
      horizontalAlignment: ToastHorizontalAlignment.END,
      verticalAlignment: ToastVerticalAlignment.TOP,
    },
    content: 'Something',
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardToastAlertComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(StandardToastAlertComponent)
    component = fixture.componentInstance
    component.toast = exampleToast
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
