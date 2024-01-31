import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DetermineDiceFairnessAssignmentProcessComponent } from './determine-dice-fairness-assignment-process.component'

describe('DetermineDiceFairnessAssignmentProcessComponent', () => {
  let component: DetermineDiceFairnessAssignmentProcessComponent
  let fixture: ComponentFixture<DetermineDiceFairnessAssignmentProcessComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetermineDiceFairnessAssignmentProcessComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(
      DetermineDiceFairnessAssignmentProcessComponent,
    )
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
