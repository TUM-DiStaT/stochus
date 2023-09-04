import { ComponentFixture, TestBed } from '@angular/core/testing'
import { EditStudyFormComponent } from './edit-study-form.component'

describe('EditStudyFormComponent', () => {
  let component: EditStudyFormComponent
  let fixture: ComponentFixture<EditStudyFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStudyFormComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(EditStudyFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
