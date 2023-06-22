import { ComponentFixture, TestBed } from '@angular/core/testing'
import { GuessRandomNumberAssignmentProcessComponent } from './guess-random-number-assignment-process.component'

describe('GuessRandomNumberAssignmentProcessComponent', () => {
  let component: GuessRandomNumberAssignmentProcessComponent
  let fixture: ComponentFixture<GuessRandomNumberAssignmentProcessComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessRandomNumberAssignmentProcessComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(
      GuessRandomNumberAssignmentProcessComponent,
    )
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
