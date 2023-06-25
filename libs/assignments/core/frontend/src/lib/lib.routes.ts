import { Route } from '@angular/router'
import { AssignmentsListComponent } from './assignments-list/assignments-list.component'

export const assignmentsCoreFrontendRoutes: Route[] = [
  { path: '', pathMatch: 'full', component: AssignmentsListComponent },
]
