import { inject } from '@angular/core'
import { ActivatedRouteSnapshot, Route, Router } from '@angular/router'
import { firstValueFrom, map } from 'rxjs'
import { BaseCompletionData } from '@stochus/assignments/model/shared'
import { AlertComponent } from '@stochus/daisy-ui'
import { AssignmentCompletionProcessHostComponent } from './assignment-completion-process-host/assignment-completion-process-host.component'
import { AssignmentsListComponent } from './assignments-list/assignments-list.component'
import { AssignmentsService } from './assignments.service'
import { CompletionsService } from './completions.service'

export const assignmentsCoreFrontendRoutes: Route[] = [
  { path: '', pathMatch: 'full', component: AssignmentsListComponent },
  {
    path: ':assignmentId',
    component: AssignmentCompletionProcessHostComponent,
    canActivate: [
      (route: ActivatedRouteSnapshot) => {
        if (
          AssignmentsService.getById(route.paramMap.get('assignmentId')) ===
          undefined
        ) {
          return inject(Router).parseUrl('/assignments')
        }

        return true
      },
    ],
  },
]

export const completionsCoreForFrontendRoutes: Route[] = [
  {
    path: ':completionId/feedback',
    // TODO: replace me
    component: AlertComponent,
    canActivate: [
      async (route: ActivatedRouteSnapshot) => {
        const completionId = route.paramMap.get('completionId')
        const router = inject(Router)

        if (!completionId) {
          return router.navigate(['/assignments'])
        }

        const isCompleted$ = inject(CompletionsService)
          .getById(completionId)
          .pipe(
            map(
              (completion) =>
                (completion?.completionData as BaseCompletionData).progress ===
                1,
            ),
          )

        if (!(await firstValueFrom(isCompleted$))) {
          return router.navigate(['completions', completionId])
        }

        return true
      },
    ],
  },
]
