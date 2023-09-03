import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { heroPencil, heroPlus, heroTrash } from '@ng-icons/heroicons/outline'
import { StudyDto } from '@stochus/studies/shared'
import { StudiesService } from '../studies.service'

@Component({
  selector: 'stochus-studies-management-overview',
  standalone: true,
  imports: [CommonModule, NgIconComponent, RouterLink],
  providers: [provideIcons({ heroTrash, heroPencil, heroPlus })],
  templateUrl: './studies-management-overview.component.html',
})
export class StudiesManagementOverviewComponent {
  studies$ = this.studiesService.getAllOwnedByUser()

  constructor(private studiesService: StudiesService) {}

  getActivityStatus(study: StudyDto) {
    const now = new Date().valueOf()
    if (study.startDate.valueOf() > now) {
      return 'planned'
    }
    if (study.endDate.valueOf() > now) {
      return 'active'
    }
    return 'completed'
  }
}
