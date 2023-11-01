import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { EMPTY, catchError, switchMap } from 'rxjs'
import { ToastService } from '@stochus/daisy-ui'
import { StudiesParticipationService } from '../studies-participation.service'

@Component({
  standalone: true,
  selector: 'stochus-study-task',
  templateUrl: './study-task.component.html',
  imports: [AsyncPipe],
})
export class StudyTaskComponent {
  participation$ = this.activatedRoute.paramMap.pipe(
    switchMap((map) => {
      const studyId = map.get('studyId')
      if (studyId) {
        return this.studiesParticipationService.getWithAssignmentCompletions(
          studyId,
        )
      } else {
        this.toastService.error('Konnte Studie nicht finden')
        this.router.navigate([''])
        return EMPTY
      }
    }),
    catchError((e) => {
      console.error(e)
      this.toastService.error(
        'Beim Abrufen der Teilnahmedaten ist ein Fehler aufgetreten',
      )
      this.router.navigate([''])
      return EMPTY
    }),
  )

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly studiesParticipationService: StudiesParticipationService,
    private readonly toastService: ToastService,
    private readonly router: Router,
  ) {}
}
