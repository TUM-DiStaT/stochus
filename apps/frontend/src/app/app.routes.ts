import { inject } from '@angular/core'
import { Route, Router } from '@angular/router'
import { map, of, switchMap } from 'rxjs'
import { UserRoles } from '@stochus/auth/shared'
import { AuthGuard, PublicOnlyGuard, UserService } from '@stochus/auth/frontend'
import { StudiesService } from '@stochus/studies/frontend-static'
import { DashboardComponent } from './dashboard/dashboard.component'
import { LandingpageComponent } from './landingpage/landingpage.component'

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
    title: 'Dashboard | Stochus',
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [
      () => {
        const userService = inject(UserService)
        const router = inject(Router)
        const studiesService = inject(StudiesService)

        return userService.userHasRole(UserRoles.RESEARCHER).pipe(
          switchMap((isResearcher) => {
            if (isResearcher) {
              router.navigate(['studiesManagement']).catch(console.error)
              return of(false)
            }

            return studiesService.hasActiveStudies().pipe(
              map((hasActiveStudies) => {
                if (!hasActiveStudies) {
                  router.navigate(['assignments']).catch(console.error)
                }
                return hasActiveStudies
              }),
            )
          }),
        )
      },
    ],
  },
  {
    path: 'assignments',
    canActivate: [AuthGuard],
    data: {
      roles: [UserRoles.STUDENT],
    },
    loadChildren: () =>
      import('@stochus/assignment/core/frontend').then(
        (mod) => mod.assignmentsCoreFrontendRoutes,
      ),
  },
  {
    path: 'completions',
    canActivate: [AuthGuard],
    data: {
      roles: [UserRoles.STUDENT],
    },
    loadChildren: () =>
      import('@stochus/assignment/core/frontend').then(
        (mod) => mod.completionsCoreForFrontendRoutes,
      ),
  },
  {
    path: 'studiesManagement',
    canActivate: [AuthGuard],
    data: {
      roles: [UserRoles.RESEARCHER],
    },
    loadChildren: () =>
      import('@stochus/studies/frontend').then(
        (mod) => mod.studiesManagementRoutes,
      ),
  },
  {
    path: 'studies',
    canActivate: [AuthGuard],
    data: {
      roles: [UserRoles.STUDENT],
    },
    loadChildren: () =>
      import('@stochus/studies/frontend').then(
        (mod) => mod.studiesParticipationRoutes,
      ),
  },
  {
    path: '*',
    redirectTo: '',
  },
]
