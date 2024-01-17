import { AsyncPipe } from '@angular/common'
import { Component, Input } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { NgChartsModule } from 'ng2-charts'
import { FormModel } from 'ngx-mf'
import { IdentifySharedCharacteristicsAssignmentConfiguration } from '@stochus/assignments/identify-shared-characteristics/shared'
import { AssignmentConfigFormProps } from '@stochus/assignments/model/frontend'
import { HistogramComponent } from '@stochus/core/frontend'

@Component({
  standalone: true,
  templateUrl: './identify-shared-characteristics-config-form.component.html',
  styles: [':host { display: contents }'],
  imports: [ReactiveFormsModule, NgChartsModule, AsyncPipe, HistogramComponent],
})
export class IdentifySharedCharacteristicsConfigFormComponent
  implements
    AssignmentConfigFormProps<IdentifySharedCharacteristicsAssignmentConfiguration>
{
  @Input()
  formControl!: FormModel<IdentifySharedCharacteristicsAssignmentConfiguration>
}
