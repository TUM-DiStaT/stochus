import { AsyncPipe } from '@angular/common'
import { Component, Input, OnDestroy } from '@angular/core'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { ChartData, ChartOptions } from 'chart.js'
import DataLabelsPlugin from 'chartjs-plugin-datalabels'
import { NgChartsModule } from 'ng2-charts'
import { FormModel } from 'ngx-mf'
import {
  Observable,
  concat,
  debounceTime,
  filter,
  map,
  of,
  shareReplay,
} from 'rxjs'
import { ExtractFromHistogramAssignmentConfiguration } from '@stochus/assignments/extract-from-histogram-assignment/shared'
import { AssignmentConfigFormProps } from '@stochus/assignments/model/frontend'
import { computeChartDataForHistogram } from '../utils/compute-chart-data-for-histogram'

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

  chartOptions$ = this.parsedCsv$.pipe(
    filter(Boolean),
    debounceTime(1000),
    map((data): ChartOptions => {
      const min = Math.min(...data)
      const max = Math.max(...data)
      return {
        // We use these empty structures as placeholders for dynamic theming.
        scales: {
          inputRangeX: {
            type: 'linear',
            position: 'bottom',
            axis: 'x',
            // compute custom grace / offset to account for bar widths
            // in the bar chart. this ensures that some x position here
            // aligns perfectly with the center of the corresponding bar
            min: min - 0.5,
            max: max + 0.5,
            grace: 0,
            offset: false,
            display: false,
          },
          fullVerticalLineY: {
            type: 'linear',
            position: 'right',
            axis: 'y',
            min: 0,
            max: 1,
            display: false,
          },
          histogramY: {
            type: 'linear',
            position: 'left',
            axis: 'y',
            title: {
              text: 'Häufigkeit',
              display: true,
            },
          },
          boxplotY: {
            type: 'category',
            axis: 'y',
            labels: ['Boxplot'],
            display: false,
          },
        },
        plugins: {
          legend: {
            display: true,
          },
          datalabels: {
            anchor: 'end',
            align: 'end',
          },
        },
      }
    }),
  )
  chartPlugins = [DataLabelsPlugin]
  chartData$: Observable<ChartData> = this.parsedCsv$.pipe(
    filter(Boolean),
    debounceTime(1000),
    map((data) =>
      computeChartDataForHistogram(data, {
        showBoxPlot: true,
      }),
    ),
  )

  ngOnDestroy() {
    this.csvTransformationSubscription.unsubscribe()
  }
}
