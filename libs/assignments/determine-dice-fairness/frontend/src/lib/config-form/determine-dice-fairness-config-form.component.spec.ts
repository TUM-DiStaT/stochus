import { ComponentFixture, TestBed } from '@angular/core/testing'
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
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
