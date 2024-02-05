import { Directive, DoCheck, Input, OnDestroy, OnInit } from '@angular/core'
import {
  AbstractControl,
  FormControl,
  NgControl,
  Validators,
} from '@angular/forms'
import {
  EMPTY,
  Observable,
  Subscription,
  concat,
  map,
  of,
  shareReplay,
} from 'rxjs'
import { parseIntegersCsv } from '@stochus/core/shared'

@Directive({
  selector: 'input[stochusCsvInput], textarea[stochusCsvInput]',
  standalone: true,
})
export class CsvInputDirective implements OnInit, OnDestroy, DoCheck {
  static generateCsvStringFormControl() {
    return new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.pattern(/^\s*,?\s*\d+\s*(?:,\s*\d+\s*)*,?\s*$/),
      ],
    })
  }

  private _arrayInputFormControl?: AbstractControl<number[] | null | undefined>
  private parsedCsv$?: Observable<number[] | undefined>
  private csvTransformationSubscription?: Subscription

  constructor(private ngControl: NgControl) {}

  @Input()
  set arrayInputFormControl(
    csvControl: AbstractControl<number[] | null | undefined>,
  ) {
    csvControl.addValidators(() => {
      if (this.ngControl.control?.invalid) {
        return { invalidCsv: true }
      }
      return null
    })
    this._arrayInputFormControl = csvControl
    this.ngControl.control?.setValue(csvControl.value?.join(', ') ?? '', {
      emitEvent: true,
    })
  }

  get arrayInputFormControl():
    | AbstractControl<number[] | null | undefined>
    | undefined {
    return this._arrayInputFormControl
  }

  ngOnInit(): void {
    this.parsedCsv$ = concat(
      of(this.arrayInputFormControl?.value?.join(', ') ?? ''),
      this.ngControl.control?.valueChanges ?? EMPTY,
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

    this.csvTransformationSubscription = this.parsedCsv$.subscribe((data) => {
      if (data !== undefined) {
        this._arrayInputFormControl?.patchValue(data, {})
      } else {
        // Needed to re-run the validator that is added up above
        // because we don't update the value but the validator
        // will still return a different result
        this._arrayInputFormControl?.updateValueAndValidity()
      }
    })
  }

  ngOnDestroy(): void {
    this.csvTransformationSubscription?.unsubscribe()
  }

  // Necessary workaround as there is no touched event on formControls
  // https://github.com/angular/angular/issues/10887
  ngDoCheck(): void {
    if (this.ngControl.control?.touched) {
      this._arrayInputFormControl?.markAsTouched()
    }
  }
}
