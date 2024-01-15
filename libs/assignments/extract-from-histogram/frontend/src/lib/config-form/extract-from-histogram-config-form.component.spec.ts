import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, FormGroup } from '@angular/forms'
import { ExtractableProperty } from '@stochus/assignments/extract-from-histogram-assignment/shared'
import { ExtractFromHistogramConfigFormComponent } from './extract-from-histogram-config-form.component'

describe('GuessRandomNumberConfigFormComponent', () => {
  let component: ExtractFromHistogramConfigFormComponent
  let fixture: ComponentFixture<ExtractFromHistogramConfigFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtractFromHistogramConfigFormComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ExtractFromHistogramConfigFormComponent)
    component = fixture.componentInstance
    component.formControl = new FormGroup({
      targetProperty: new FormControl<ExtractableProperty>('mean'),
      data: new FormControl([1, 2, 3]),
    })
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
