import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import 'reflect-metadata'
import { of } from 'rxjs'
import { GuessRandomNumberAssignment } from '@stochus/assignments/demos/guess-random-number/shared'
import { AssignmentCompletionProcessHostComponent } from './assignment-completion-process-host.component'

describe('AssignmentCompletionProcessHostComponent', () => {
  let component: AssignmentCompletionProcessHostComponent
  let fixture: ComponentFixture<AssignmentCompletionProcessHostComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AssignmentCompletionProcessHostComponent,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              assignmentId: GuessRandomNumberAssignment.id,
            }),
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(AssignmentCompletionProcessHostComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
