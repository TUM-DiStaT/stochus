import { Route } from '@angular/router'
import { CreateStudyComponent } from './create-study/create-study.component'
import { EditStudyComponent } from './edit-study/edit-study.component'
import { StudiesManagementOverviewComponent } from './studies-management-overview/studies-management-overview.component'

export const studiesManagementRoutes: Route[] = [
  { path: '', component: StudiesManagementOverviewComponent },
  { path: 'edit/:studyId', component: EditStudyComponent },
  { path: 'new', component: CreateStudyComponent },
]
