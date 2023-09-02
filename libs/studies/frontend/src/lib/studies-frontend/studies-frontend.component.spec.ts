import { ComponentFixture, TestBed } from '@angular/core/testing'
import { StudiesFrontendComponent } from './studies-frontend.component'

describe('StudiesFrontendComponent', () => {
  let component: StudiesFrontendComponent
  let fixture: ComponentFixture<StudiesFrontendComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudiesFrontendComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(StudiesFrontendComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
