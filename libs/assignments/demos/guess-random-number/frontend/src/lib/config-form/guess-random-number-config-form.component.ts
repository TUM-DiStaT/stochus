import { Component, Input } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { FormModel } from 'ngx-mf'
import { GuessRandomNumberAssignmentConfiguration } from '@stochus/assignments/demos/guess-random-number/shared'
import { AssignmentConfigFormProps } from '@stochus/assignments/model/frontend'

@Component({
  selector: 'stochus-guess-random-number-config-form',
  standalone: true,
  templateUrl: './guess-random-number-config-form.component.html',
  styles: [':host { display: contents }'],
  imports: [ReactiveFormsModule],
})
export class GuessRandomNumberConfigFormComponent
  implements
    AssignmentConfigFormProps<GuessRandomNumberAssignmentConfiguration>
{
  @Input()
  formControl!: FormModel<GuessRandomNumberAssignmentConfiguration>
}
