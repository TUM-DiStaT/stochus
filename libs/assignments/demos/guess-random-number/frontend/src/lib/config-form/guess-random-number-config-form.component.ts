import { Component, EventEmitter } from '@angular/core'
import { GuessRandomNumberAssignmentConfiguration } from '@stochus/assignments/demos/guess-random-number/shared'
import { AssignmentConfigFormProps } from '@stochus/assignments/model/frontend'

@Component({
  selector: 'stochus-guess-random-number-config-form',
  standalone: true,
  templateUrl: './guess-random-number-config-form.component.html',
})
export class GuessRandomNumberConfigFormComponent
  implements
    AssignmentConfigFormProps<GuessRandomNumberAssignmentConfiguration>
{
  submitConfig = new EventEmitter<GuessRandomNumberAssignmentConfiguration>()
}
