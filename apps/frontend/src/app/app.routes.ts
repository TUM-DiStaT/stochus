import { Route } from '@angular/router'
import { LandingpageComponent } from './landingpage/landingpage.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { AuthGuard } from '@stochus/auth/frontend'
import { PublicOnlyGuard } from '../../../../libs/auth/frontend/src/lib/public-only.guard'

export const appRoutes: Route[] = [
  {
    title: 'Stochus',
    path: '',
    component: LandingpageComponent,
    canActivate: [PublicOnlyGuard],
  },
  {
    title: 'Stochus',
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '*',
    redirectTo: '',
  },
]
