import { Component, Input } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { FormModel } from 'ngx-mf'
import { ExtractFromHistogramAssignmentConfiguration } from '@stochus/assignments/extract-from-histogram-assignment/shared'
import { AssignmentConfigFormProps } from '@stochus/assignments/model/frontend'

@Component({
  standalone: true,
  templateUrl: './extract-from-histogram-config-form.component.html',
  styles: [':host { display: contents }'],
  imports: [ReactiveFormsModule],
})
export class ExtractFromHistogramConfigFormComponent
  implements
    AssignmentConfigFormProps<ExtractFromHistogramAssignmentConfiguration>
{
  @Input()
  formControl!: FormModel<ExtractFromHistogramAssignmentConfiguration>
}
