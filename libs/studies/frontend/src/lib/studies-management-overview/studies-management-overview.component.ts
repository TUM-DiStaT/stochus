import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import {
  heroArrowDownTray,
  heroCalendar,
  heroCheck,
  heroMinusSmall,
  heroPencil,
  heroPlus,
  heroTrash,
} from '@ng-icons/heroicons/outline'
import { firstValueFrom } from 'rxjs'
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
      heroArrowDownTray,
    }),
  ],
  templateUrl: './studies-management-overview.component.html',
})
export class StudiesManagementOverviewComponent {
  studies$ = this.studiesService.getAllOwnedByUser()

  constructor(
    private readonly studiesService: StudiesService,
    private readonly toastService: ToastService,
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

  async getParticipationDataForDownload(study: StudyDto) {
    const data = await firstValueFrom(
      this.studiesService.getAllDataForDownload(study),
    )
    const fileContent = JSON.stringify(data, null, 2)
    const blob = new Blob([fileContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${study.name.replaceAll(/[^a-z0-9\-_ ]+/gim, '_')}.json`
    anchor.type = 'application/json'

    anchor.click()

    anchor.remove()
    URL.revokeObjectURL(url)
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
