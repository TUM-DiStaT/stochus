import { ComponentFixture, TestBed } from '@angular/core/testing'
import 'jest-canvas-mock'
import { ExtractFromHistogramAssignmentProcessComponent } from './extract-from-histogram-assignment-process.component'

describe('ExtractFromHistogramAssignmentFrontendComponent', () => {
  let component: ExtractFromHistogramAssignmentProcessComponent
  let fixture: ComponentFixture<ExtractFromHistogramAssignmentProcessComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtractFromHistogramAssignmentProcessComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(
      ExtractFromHistogramAssignmentProcessComponent,
    )
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
