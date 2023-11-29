import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { MonacoEditorModule } from 'ngx-monaco-editor-v2'
import 'reflect-metadata'
import { EMPTY, NEVER } from 'rxjs'
import { KeycloakAdminService } from '@stochus/auth/frontend'
import { StudiesService } from '@stochus/studies/frontend-static'
import { EditStudyFormComponent } from './edit-study-form.component'

describe('EditStudyFormComponent', () => {
  let component: EditStudyFormComponent
  let fixture: ComponentFixture<EditStudyFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditStudyFormComponent,
        MonacoEditorModule.forRoot(),
        MonacoEditorModule,
      ],
      providers: [
        {
          provide: KeycloakAdminService,
          useValue: {
            getGroups: () => NEVER,
          },
        },
        // Needed for the feedback preview
        {
          provide: ActivatedRoute,
          useValue: { paramMap: EMPTY },
        },
        {
          provide: StudiesService,
          useValue: {},
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(EditStudyFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  // TODO

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
