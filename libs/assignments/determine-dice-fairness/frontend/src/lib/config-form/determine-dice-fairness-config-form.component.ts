import { CommonModule, JsonPipe } from '@angular/common'
import { Component, Input } from '@angular/core'
import {
  FormArray,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { heroInformationCircle } from '@ng-icons/heroicons/outline'
import { FormModel } from 'ngx-mf'
import { DetermineDiceFairnessAssignmentConfiguration } from '@stochus/assignments/determine-dice-fairness/shared'
import { AssignmentConfigFormProps } from '@stochus/assignments/model/frontend'
import { CsvInputDirective } from '@stochus/core/frontend'

@Component({
  selector: 'lib-determine-dice-fairness-config-form',
  standalone: true,
  imports: [
    CommonModule,
    JsonPipe,
    CsvInputDirective,
    FormsModule,
    ReactiveFormsModule,
    NgIconComponent,
  ],
  providers: [provideIcons({ heroInformationCircle })],
  templateUrl: './determine-dice-fairness-config-form.component.html',
})
export class DetermineDiceFairnessConfigFormComponent
  implements
    AssignmentConfigFormProps<DetermineDiceFairnessAssignmentConfiguration>
{
  readonly theCsvControl = CsvInputDirective.generateCsvStringFormControl()

  private _formControl!: FormModel<DetermineDiceFairnessAssignmentConfiguration>

  @Input()
  set formControl(
    formControl: FormModel<DetermineDiceFairnessAssignmentConfiguration>,
  ) {
    this._formControl = formControl
  }

  get formControl() {
    return this._formControl
  }

  get proportionControls() {
    return this.formControl.controls.proportions as unknown as FormArray<
      FormControl<number>
    >
  }
}
