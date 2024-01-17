import { ComponentFixture, TestBed } from '@angular/core/testing'
import 'jest-canvas-mock'
import { ExtractFromHistogramAssignmentFeedbackComponent } from './extract-from-histogram-assignment-feedback.component'

describe('GuessRandomNumberAssignmentFeedbackComponent', () => {
  let component: ExtractFromHistogramAssignmentFeedbackComponent
  let fixture: ComponentFixture<ExtractFromHistogramAssignmentFeedbackComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtractFromHistogramAssignmentFeedbackComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(
      ExtractFromHistogramAssignmentFeedbackComponent,
    )
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
