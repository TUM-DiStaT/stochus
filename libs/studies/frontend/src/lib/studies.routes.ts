import { Route } from '@angular/router'
import { CreateStudyComponent } from './create-study/create-study.component'
import { EditStudyComponent } from './edit-study/edit-study.component'
import { StudyTaskComponent } from './participate/study-task.component'
import { StudiesManagementOverviewComponent } from './studies-management-overview/studies-management-overview.component'
import { StudyFeedbackComponent } from './study-feedback/study-feedback.component'

export const studiesManagementRoutes: Route[] = [
  { path: '', component: StudiesManagementOverviewComponent },
  { path: 'edit/:studyId', component: EditStudyComponent },
  { path: 'new', component: CreateStudyComponent },
]
export const studiesParticipationRoutes: Route[] = [
  { path: 'participate/:studyId', component: StudyTaskComponent },
  { path: 'completed/:studyId', component: StudyFeedbackComponent },
]
