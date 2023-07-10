import { CommonModule } from '@angular/common'
import { Component, HostBinding } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { heroAcademicCap, heroCalendar } from '@ng-icons/heroicons/outline'
import { ButtonColor, ButtonComponent } from '@stochus/daisy-ui'

@Component({
  selector: 'stochus-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FormsModule, NgIconComponent],
  providers: [provideIcons({ heroCalendar, heroAcademicCap })],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  @HostBinding('class')
  readonly class = 'p-10 flex items-center justify-center'

  protected readonly ButtonColor = ButtonColor
}
