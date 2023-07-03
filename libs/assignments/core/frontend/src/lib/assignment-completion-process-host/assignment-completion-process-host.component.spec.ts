import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AssignmentCompletionProcessHostComponent } from './assignment-completion-process-host.component'

describe('AssignmentCompletionProcessHostComponent', () => {
  let component: AssignmentCompletionProcessHostComponent
  let fixture: ComponentFixture<AssignmentCompletionProcessHostComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentCompletionProcessHostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AssignmentCompletionProcessHostComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
