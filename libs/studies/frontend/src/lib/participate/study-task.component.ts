import { AsyncPipe } from '@angular/common'
import { Component, HostListener, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
  BehaviorSubject,
  EMPTY,
  catchError,
  combineLatest,
  filter,
  firstValueFrom,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs'
import { BaseCompletionData } from '@stochus/assignments/model/shared'
import {
  AssignmentCompletionProcessHostComponent,
  AssignmentsService,
} from '@stochus/assignment/core/frontend'
import { InteractionLogsService } from '@stochus/interaction-logs/frontend'
import { StudiesParticipationService } from '@stochus/studies/frontend-static'
import { ToastService } from '@stochus/daisy-ui'

@Component({
  standalone: true,
  selector: 'stochus-study-task',
  templateUrl: './study-task.component.html',
  imports: [AsyncPipe, AssignmentCompletionProcessHostComponent],
})
export class StudyTaskComponent implements OnDestroy {
  activeCompletionIndex$ = new BehaviorSubject<number | undefined>(undefined)
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
    tap((participation) => {
      const firstNotCompletedIndex =
        participation.assignmentCompletions.findIndex(
          (completion) =>
            (completion.completionData as BaseCompletionData).progress < 1,
        )

      this.activeCompletionIndex$.next(firstNotCompletedIndex)
      firstValueFrom(
        this.interactionLogsService.logForStudyParticipation(participation.id, {
          payload: {
            action: 'participation-resumed',
          },
        }),
      ).catch(console.error)
    }),
    catchError((e) => {
      console.error(e)
      this.toastService.error(
        'Beim Abrufen der Teilnahmedaten ist ein Fehler aufgetreten',
      )
      this.router.navigate([''])
      return EMPTY
    }),
    shareReplay(),
  )

  currCompletion$ = combineLatest([
    this.participation$,
    this.activeCompletionIndex$.pipe(
      filter((index): index is number => index !== undefined),
    ),
  ]).pipe(
    switchMap(([participation, activeCompletionIndex]) => {
      if (
        activeCompletionIndex < 0 ||
        activeCompletionIndex >= participation.assignmentCompletions.length
      ) {
        firstValueFrom(
          this.interactionLogsService.logForStudyParticipation(
            participation.studyId,
            {
              payload: {
                action: 'study-completed',
              },
            },
          ),
        ).catch(console.error)
        this.router.navigate(['studies', 'completed', participation.studyId])
        return EMPTY
      }

      return of(participation.assignmentCompletions[activeCompletionIndex])
    }),
    shareReplay(),
  )
  currAssignment$ = this.currCompletion$.pipe(
    map((completion) =>
      AssignmentsService.getByIdOrError(completion.assignmentId),
    ),
  )

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly studiesParticipationService: StudiesParticipationService,
    private readonly interactionLogsService: InteractionLogsService,
    private readonly toastService: ToastService,
    private readonly router: Router,
  ) {}

  onCompleteAssignment() {
    this.activeCompletionIndex$.next(
      (this.activeCompletionIndex$.value ?? -1) + 1,
    )
  }

  async ngOnDestroy() {
    const participation = await firstValueFrom(this.participation$)
    await firstValueFrom(
      this.interactionLogsService.logForStudyParticipation(participation.id, {
        payload: {
          action: 'participation-paused',
        },
      }),
    )
  }

  @HostListener('document:visibilitychange', ['$event'])
  async onVisibilityChange() {
    const participation = await firstValueFrom(this.participation$)
    if (document.visibilityState === 'visible') {
      await firstValueFrom(
        this.interactionLogsService.logForStudyParticipation(participation.id, {
          payload: {
            action: 'tabbed-back-in',
          },
        }),
      )
    } else {
      await firstValueFrom(
        this.interactionLogsService.logForStudyParticipation(participation.id, {
          payload: {
            action: 'tabbed-out',
          },
        }),
      )
    }
  }
}
