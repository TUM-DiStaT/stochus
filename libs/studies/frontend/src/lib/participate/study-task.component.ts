import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { EMPTY, catchError, filter, map, switchMap } from 'rxjs'
import { BaseCompletionData } from '@stochus/assignments/model/shared'
import { AssignmentsService } from '@stochus/assignment/core/frontend'
import { ToastService } from '@stochus/daisy-ui'
import { AssignmentCompletionProcessHostComponent } from '../../../../../assignments/core/frontend/src/lib/assignment-completion-process-host/assignment-completion-process-host.component'
import { StudiesParticipationService } from '../studies-participation.service'

@Component({
  standalone: true,
  selector: 'stochus-study-task',
  templateUrl: './study-task.component.html',
  imports: [AsyncPipe, AssignmentCompletionProcessHostComponent],
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

  currCompletion$ = this.participation$.pipe(
    map((participation) =>
      participation.assignmentCompletions.find(
        (completion) =>
          (completion.completionData as BaseCompletionData).progress < 1,
      ),
    ),
    filter(Boolean),
  )
  currAssignment$ = this.currCompletion$.pipe(
    map((completion) =>
      AssignmentsService.getByIdOrError(completion.assignmentId),
    ),
  )

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly studiesParticipationService: StudiesParticipationService,
    private readonly toastService: ToastService,
    private readonly router: Router,
  ) {}
}
