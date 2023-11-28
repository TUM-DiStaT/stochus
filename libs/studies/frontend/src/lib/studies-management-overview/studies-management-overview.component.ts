import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import {
  heroCalendar,
  heroCheck,
  heroMinusSmall,
  heroPencil,
  heroPlus,
  heroTrash,
} from '@ng-icons/heroicons/outline'
import { StudyDto } from '@stochus/studies/shared'
import { ToastService } from '@stochus/daisy-ui'
import { StudiesService } from '../studies.service'

@Component({
  selector: 'stochus-studies-management-overview',
  standalone: true,
  imports: [CommonModule, NgIconComponent, RouterLink],
  providers: [
    provideIcons({
      heroTrash,
      heroPencil,
      heroPlus,
      heroCalendar,
      heroCheck,
      heroMinusSmall,
    }),
  ],
  templateUrl: './studies-management-overview.component.html',
})
export class StudiesManagementOverviewComponent {
  studies$ = this.studiesService.getAllOwnedByUser()

  constructor(
    private studiesService: StudiesService,
    private toastService: ToastService,
  ) {}

  deleteStudy(study: StudyDto) {
    this.studiesService.delete(study).subscribe({
      next: () => {
        this.studies$ = this.studiesService.getAllOwnedByUser()
      },
      error: (e) => {
        console.error(e)
        this.toastService.error(
          'Beim löschen der Studie ist etwas schiefgegangen',
        )
      },
    })
  }

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

  getReadableProgress(study: StudyDto) {
    return Math.floor(study.overallProgress * 100)
  }

  getProgressStyle(progress: number) {
    return {
      '--value': progress,
      '--size': '3em',
    }
  }
}
