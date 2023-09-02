import { Route } from '@angular/router'
import { CreateStudyComponent } from './create-study/create-study.component'
import { StudiesFrontendComponent } from './studies-frontend/studies-frontend.component'

export const studiesManagementRoutes: Route[] = [
  { path: '', component: StudiesFrontendComponent },
  { path: 'new', component: CreateStudyComponent },
]
