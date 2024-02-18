import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder } from '@angular/forms'
import { DetermineDiceFairnessAssignment } from '@stochus/assignments/determine-dice-fairness/shared'
import { DetermineDiceFairnessAssignmentForFrontend } from '../determine-dice-fairness-assignment-for-frontend'
import { DetermineDiceFairnessConfigFormComponent } from './determine-dice-fairness-config-form.component'

describe('DetermineDiceFairnessConfigFormComponent', () => {
  let component: DetermineDiceFairnessConfigFormComponent
  let fixture: ComponentFixture<DetermineDiceFairnessConfigFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetermineDiceFairnessConfigFormComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(DetermineDiceFairnessConfigFormComponent)
    component = fixture.componentInstance
    component.formControl =
      DetermineDiceFairnessAssignmentForFrontend.generateConfigFormControl(
        new FormBuilder(),
        DetermineDiceFairnessAssignment.getRandomConfig(),
      )
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
