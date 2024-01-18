import { AsyncPipe } from '@angular/common'
import { Component, Input, OnDestroy } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { NgChartsModule } from 'ng2-charts'
import { FormModel } from 'ngx-mf'
import { concat, debounceTime, filter, map, of, shareReplay } from 'rxjs'
import { ExtractFromHistogramAssignmentConfiguration } from '@stochus/assignments/extract-from-histogram-assignment/shared'
import { parseIntegersCsv } from '@stochus/core/shared'
import { AssignmentConfigFormProps } from '@stochus/assignments/model/frontend'
import { HistogramComponent } from '@stochus/core/frontend'

@Component({
  standalone: true,
  templateUrl: './extract-from-histogram-config-form.component.html',
  styles: [':host { display: contents }'],
  imports: [ReactiveFormsModule, NgChartsModule, AsyncPipe, HistogramComponent],
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
    this.csvFormControl.setValue(formControl.value.data?.join(', ') ?? '', {
      emitEvent: true,
    })
  }

  get formControl() {
    return this._formControl
  }

  csvFormControl = new FormControl<string>(
    this.formControl?.controls.data?.value?.join(', ') ?? '',
    {
      validators: [
        Validators.required,
        Validators.pattern(/^\s*,?\s*\d+\s*(?:,\s*\d+\s*)*,?\s*$/),
      ],
    },
  )
  parsedCsv$ = concat(
    of(this.formControl?.controls.data?.value?.join(', ') ?? ''),
    this.csvFormControl.valueChanges,
  ).pipe(
    shareReplay(),
    map((value) => {
      try {
        return parseIntegersCsv(value)
      } catch (e) {
        return undefined
      }
    }),
    shareReplay(),
  )
  debouncedParsedCsv$ = this.parsedCsv$.pipe(
    filter(Boolean),
    debounceTime(1000),
  )
  csvTransformationSubscription = this.parsedCsv$.subscribe((data) => {
    this.formControl?.patchValue(
      {
        data,
      },
      {},
    )
  })

  ngOnDestroy() {
    this.csvTransformationSubscription.unsubscribe()
  }
}
