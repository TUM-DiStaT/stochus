import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
  GuessRandomNumberAssignmentFeedbackComponent,
  getOptimalGuessesForResult,
} from './guess-random-number-assignment-feedback.component'

describe('getOptimalGuessesForResult', () => {
  it('should guess 50 on its first try', () => {
    expect(getOptimalGuessesForResult(50)).toEqual([50])
  })

  it('should guess 25 if 50 was too high', () => {
    expect(getOptimalGuessesForResult(1)[1]).toBe(25)
  })

  it('should guess 75 if 50 was too low', () => {
    expect(getOptimalGuessesForResult(99)[1]).toBe(75)
  })

  it('should work for 14', () => {
    expect(getOptimalGuessesForResult(14)).toMatchInlineSnapshot(`
      [
        50,
        25,
        12,
        18,
        15,
        13,
        14,
      ]
    `)
  })
})

describe('GuessRandomNumberAssignmentFeedbackComponent', () => {
  let component: GuessRandomNumberAssignmentFeedbackComponent
  let fixture: ComponentFixture<GuessRandomNumberAssignmentFeedbackComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessRandomNumberAssignmentFeedbackComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(
      GuessRandomNumberAssignmentFeedbackComponent,
    )
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
