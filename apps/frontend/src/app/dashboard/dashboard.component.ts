import { CommonModule } from '@angular/common'
import { Component, HostBinding } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { heroAcademicCap, heroCalendar } from '@ng-icons/heroicons/outline'
import * as moment from 'moment'
import { firstValueFrom } from 'rxjs'
import {
  StudiesParticipationService,
  StudiesService,
} from '@stochus/studies/frontend'
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

  readonly ButtonColor = ButtonColor
  readonly studies$ = this.studiesService.getAllForStudent()

  constructor(
    private readonly studiesService: StudiesService,
    private readonly studiesParticipationService: StudiesParticipationService,
    private readonly router: Router,
  ) {}

  async createNewParticipation(studyId: string) {
    await firstValueFrom(this.studiesParticipationService.create(studyId))
    await this.openStudy(studyId)
  }

  async openStudy(studyId: string) {
    await this.router.navigate(['studies', 'participate', studyId])
  }

  humanReadableDuration(target: Date) {
    const milliseconds = target.valueOf() - new Date().valueOf()
    return moment.duration(milliseconds).locale('de').humanize()
  }

  humanReadableDate(target: Date) {
    return moment(target).format('DD.MM.YYYY')
  }
}
