import { inject } from '@angular/core'
import { ActivatedRouteSnapshot, Route, Router } from '@angular/router'
import { AssignmentCompletionProcessHostComponent } from './assignment-completion-process-host/assignment-completion-process-host.component'
import { AssignmentsListComponent } from './assignments-list/assignments-list.component'
import { AssignmentsService } from './assignments.service'

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
