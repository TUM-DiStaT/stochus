import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MonacoEditorModule } from 'ngx-monaco-editor-v2'
import 'reflect-metadata'
import { NEVER } from 'rxjs'
import { KeycloakAdminService } from '@stochus/auth/frontend'
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
