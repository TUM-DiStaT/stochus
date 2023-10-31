import { ComponentFixture, TestBed } from '@angular/core/testing'
import 'reflect-metadata'
import { NEVER } from 'rxjs'
import { KeycloakAdminService } from '@stochus/auth/frontend'
import { EditStudyFormComponent } from './edit-study-form.component'

describe('EditStudyFormComponent', () => {
  let component: EditStudyFormComponent
  let fixture: ComponentFixture<EditStudyFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStudyFormComponent],
      providers: [
        {
          provide: KeycloakAdminService,
          useValue: {
            getGroups: () => NEVER,
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(EditStudyFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
