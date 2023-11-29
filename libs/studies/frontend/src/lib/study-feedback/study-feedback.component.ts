import { Component, HostBinding } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  standalone: true,
  selector: 'stochus-study-feedback',
  templateUrl: './study-feedback.component.html',
  imports: [RouterLink],
})
export class StudyFeedbackComponent {
  @HostBinding('class')
  readonly className = 'grid place-content-center flex-1'
}
