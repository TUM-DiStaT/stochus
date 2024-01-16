import { AsyncPipe } from '@angular/common'
import { Component, Input, OnDestroy } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { ChartData, ChartOptions, ChartType } from 'chart.js'
import DataLabelsPlugin from 'chartjs-plugin-datalabels'
import { NgChartsModule } from 'ng2-charts'
import { FormModel } from 'ngx-mf'
import { Observable, concat, map, of, shareReplay } from 'rxjs'
import { ExtractFromHistogramAssignmentConfiguration } from '@stochus/assignments/extract-from-histogram-assignment/shared'
import { AssignmentConfigFormProps } from '@stochus/assignments/model/frontend'

@Component({
  standalone: true,
  templateUrl: './extract-from-histogram-config-form.component.html',
  styles: [':host { display: contents }'],
  imports: [ReactiveFormsModule, NgChartsModule, AsyncPipe],
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

      return parsedCsv
    }),
  )
  csvTransformationSubscription = this.parsedCsv$.subscribe((data) => {
    this.formControl?.patchValue(
      {
        data,
      },
      {},
    )
  })

  chartType = 'bar' as const satisfies ChartType
  chartOptions: ChartOptions<typeof this.chartType> = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {},
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  }
  chartPlugins = [DataLabelsPlugin]
  chartData$: Observable<ChartData<typeof this.chartType>> =
    this.parsedCsv$.pipe(
      map((data) => {
        // compute frequency of each item in data
        const frequencies = new Map<number, number>()
        for (const item of data ?? []) {
          frequencies.set(item, (frequencies.get(item) ?? 0) + 1)
        }
        const frequencyEntries = [...frequencies.entries()].sort(
          ([a], [b]) => a - b,
        )
        return {
          labels: frequencyEntries.map(([value]) => value.toString()),
          datasets: [
            {
              data: frequencyEntries.map(([, frequency]) => frequency),
            },
          ],
        }
      }),
    )

  ngOnDestroy() {
    this.csvTransformationSubscription.unsubscribe()
  }
}
