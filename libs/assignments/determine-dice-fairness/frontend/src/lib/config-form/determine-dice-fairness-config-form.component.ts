import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { FormModel } from 'ngx-mf'
import { DetermineDiceFairnessAssignmentConfiguration } from '@stochus/assignments/determine-dice-fairness/shared'
import { AssignmentConfigFormProps } from '@stochus/assignments/model/frontend'

@Component({
  selector: 'lib-determine-dice-fairness-config-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './determine-dice-fairness-config-form.component.html',
})
export class DetermineDiceFairnessConfigFormComponent
  implements
    AssignmentConfigFormProps<DetermineDiceFairnessAssignmentConfiguration>
{
  @Input()
  formControl!: FormModel<DetermineDiceFairnessAssignmentConfiguration>
}
