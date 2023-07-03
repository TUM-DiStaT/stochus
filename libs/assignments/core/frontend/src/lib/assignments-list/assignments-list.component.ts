import { CommonModule } from '@angular/common'
import { Component, HostBinding } from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { heroEllipsisVertical, heroPlay } from '@ng-icons/heroicons/outline'
import { ButtonComponent } from '@stochus/daisy-ui'
import { AssignmentsService } from '../assignments.service'

@Component({
  selector: 'stochus-assignments-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NgIconComponent],
  templateUrl: './assignments-list.component.html',
  providers: [provideIcons({ heroPlay, heroEllipsisVertical })],
})
export class AssignmentsListComponent {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @HostBinding('class')
  className = 'flex items-stretch justify-center'

  get assignments() {
    return this.assignmentsService.getAllAssignments()
  }
}
