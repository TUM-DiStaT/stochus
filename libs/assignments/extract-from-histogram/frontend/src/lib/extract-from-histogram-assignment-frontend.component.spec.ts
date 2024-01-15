import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ExtractFromHistogramAssignmentFrontendComponent } from './extract-from-histogram-assignment-frontend.component'

describe('ExtractFromHistogramAssignmentFrontendComponent', () => {
  let component: ExtractFromHistogramAssignmentFrontendComponent
  let fixture: ComponentFixture<ExtractFromHistogramAssignmentFrontendComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtractFromHistogramAssignmentFrontendComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(
      ExtractFromHistogramAssignmentFrontendComponent,
    )
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
