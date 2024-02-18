import { AsyncPipe, JsonPipe } from '@angular/common'
import { Component, Input, OnDestroy } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { NgChartsModule } from 'ng2-charts'
import { FormModel } from 'ngx-mf'
import {
  Subscription,
  concat,
  debounceTime,
  filter,
  map,
  of,
  shareReplay,
} from 'rxjs'
import { IdentifySharedCharacteristicsAssignmentConfiguration } from '@stochus/assignments/identify-shared-characteristics/shared'
import { parseIntegersCsv } from '@stochus/core/shared'
import { AssignmentConfigFormProps } from '@stochus/assignments/model/frontend'
import { HistogramComponent } from '@stochus/core/frontend'

@Component({
  standalone: true,
  templateUrl: './identify-shared-characteristics-config-form.component.html',
  styles: [':host { display: contents }'],
  imports: [
    ReactiveFormsModule,
    NgChartsModule,
    JsonPipe,
    AsyncPipe,
    HistogramComponent,
  ],
})
export class IdentifySharedCharacteristicsConfigFormComponent
  implements
    AssignmentConfigFormProps<IdentifySharedCharacteristicsAssignmentConfiguration>,
    OnDestroy
{
  private _formControl!: FormModel<IdentifySharedCharacteristicsAssignmentConfiguration>

  get formControl(): FormModel<IdentifySharedCharacteristicsAssignmentConfiguration> {
    return this._formControl
  }

  @Input()
  set formControl(
    formControl: FormModel<IdentifySharedCharacteristicsAssignmentConfiguration>,
  ) {
    this._formControl = formControl
    this.csvInputs.setValue(this.getCsvFromFormControl())
  }

  csvInputs = this.formBuilder.array(
    Array.from({ length: 4 }, (_, index) =>
      this.formBuilder.control(
        this._formControl?.controls.datasets?.value?.[index]?.data.join(', ') ??
          '',
        [
          Validators.required,
          Validators.pattern(/^\s*,?\s*\d+\s*(?:,\s*\d+\s*)*,?\s*$/),
        ],
      ),
    ),
  )

  parsedCsv$ = concat(
    of(this.getCsvFromFormControl()),
    this.csvInputs.valueChanges,
  ).pipe(
    shareReplay(),
    map((csvStrings) =>
      csvStrings.map((csvString) => {
        try {
          return parseIntegersCsv(csvString)
        } catch (e) {
          return undefined
        }
      }),
    ),
    shareReplay(),
  )
  debouncedParsedCsv$ = this.parsedCsv$.pipe(
    filter(Boolean),
    debounceTime(1000),
  )
  private subscriptions: Subscription[] = [
    this.parsedCsv$.subscribe((parsedCsv) => {
      this.formControl?.patchValue({
        datasets: (parsedCsv as number[][]).map((data) => ({ data })),
      })
    }),
  ]

  constructor(private readonly formBuilder: FormBuilder) {}

  private getCsvFromFormControl() {
    return (
      this.formControl?.value.datasets?.map((dataset) =>
        dataset.data.join(', '),
      ) ?? ['', '', '', '']
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  get targetCharacteristicName() {
    return this.formControl.value.targetCharacteristic === 'mean'
      ? 'Durchschnitt'
      : 'Median'
  }
}
