import { Route } from '@angular/router'
import { LandingpageComponent } from './landingpage/landingpage.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { AuthGuard } from '@stochus/auth/frontend'
import { PublicOnlyGuard } from '../../../../libs/auth/frontend/src/lib/public-only.guard'
import { UserRoles } from '@stochus/auth/shared'

export type StochusRouteData = {
  hideAppUi?: boolean
  roles?: UserRoles[]
  [key: string]: unknown
}

export type StochusRoute = Route & {
  data?: StochusRouteData
}

export const appRoutes: StochusRoute[] = [
  {
    title: 'Stochus',
    path: '',
    component: LandingpageComponent,
    canActivate: [PublicOnlyGuard],
    data: {
      hideAppUi: true,
    },
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
