import { ComponentFixture, TestBed } from '@angular/core/testing'
// Just for the type import
import 'chartjs-plugin-datalabels'
import { DetermineDiceFairnessFeedbackComponent } from './determine-dice-fairness-feedback.component'

describe('DetermineDiceFairnessFeedbackComponent', () => {
  let component: DetermineDiceFairnessFeedbackComponent
  let fixture: ComponentFixture<DetermineDiceFairnessFeedbackComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetermineDiceFairnessFeedbackComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(DetermineDiceFairnessFeedbackComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
