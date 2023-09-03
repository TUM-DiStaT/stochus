import { Route } from '@angular/router'
import { CreateStudyComponent } from './create-study/create-study.component'
import { StudiesManagementOverviewComponent } from './studies-management-overview/studies-management-overview.component'

export const studiesManagementRoutes: Route[] = [
  { path: '', component: StudiesManagementOverviewComponent },
  { path: 'new', component: CreateStudyComponent },
]
