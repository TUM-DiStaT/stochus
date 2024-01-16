import { JsonPipe } from '@angular/common'
import { Component, Input, OnDestroy } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { FormModel } from 'ngx-mf'
import { ExtractFromHistogramAssignmentConfiguration } from '@stochus/assignments/extract-from-histogram-assignment/shared'
import { AssignmentConfigFormProps } from '@stochus/assignments/model/frontend'

@Component({
  standalone: true,
  templateUrl: './extract-from-histogram-config-form.component.html',
  styles: [':host { display: contents }'],
  imports: [ReactiveFormsModule, JsonPipe],
})
export class ExtractFromHistogramConfigFormComponent
  implements
    AssignmentConfigFormProps<ExtractFromHistogramAssignmentConfiguration>,
    OnDestroy
{
  private _formControl!: FormModel<ExtractFromHistogramAssignmentConfiguration>

  @Input()
  set formControl(
    formControl: FormModel<ExtractFromHistogramAssignmentConfiguration>,
  ) {
    this._formControl = formControl
    this.csvFormControl.setValue(formControl.value.data?.join(', ') ?? '')
  }
  get formControl() {
    return this._formControl
  }

  csvFormControl = new FormControl<string>('', {
    validators: [
      Validators.required,
      Validators.pattern(/^\s*,?\s*\d+\s*(?:,\s*\d+\s*)*,?\s*$/),
    ],
  })
  csvTransformationSubscription = this.csvFormControl.valueChanges.subscribe(
    (value) => {
      let parsedCsv: number[] | undefined = value
        ?.split(/\s*,\s*/gim)
        .filter(Boolean)
        .map((value) => parseFloat(value))

      if (
        parsedCsv?.some(
          (value) =>
            isNaN(value) || !isFinite(value) || Math.floor(value) !== value,
        )
      ) {
        parsedCsv = undefined
      }

      this.formControl.patchValue(
        {
          data: parsedCsv,
        },
        {},
      )
    },
  )

  ngOnDestroy() {
    this.csvTransformationSubscription.unsubscribe()
  }
}
