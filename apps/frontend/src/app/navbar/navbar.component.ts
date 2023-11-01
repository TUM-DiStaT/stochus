import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import {
  heroAcademicCap,
  heroArrowRightOnRectangle,
  heroBars3,
  heroBeaker,
  heroRectangleStack,
} from '@ng-icons/heroicons/outline'
import { KeycloakService } from 'keycloak-angular'
import { filter, map, of, switchMap } from 'rxjs'
import { UserRoles } from '@stochus/auth/shared'
import { UserService } from '@stochus/auth/frontend'
import { StudiesService } from '@stochus/studies/frontend'
import {
  ButtonComponent,
  ButtonStyle,
  NavbarComponent as DaisyNavbarComponent,
  DropdownComponent,
  MenuComponent,
  MenuItemComponent,
  NavbarCenterComponent,
  NavbarEndComponent,
  NavbarStartComponent,
  ToastService,
} from '@stochus/daisy-ui'
import { StochusRouteData } from '../app.routes'

@Component({
  selector: 'stochus-navbar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    DaisyNavbarComponent,
    NavbarStartComponent,
    NavbarCenterComponent,
    NavbarEndComponent,
    RouterLink,
    NgIconComponent,
    DropdownComponent,
    MenuComponent,
    MenuItemComponent,
  ],
  providers: [
    provideIcons({
      heroBars3,
      heroArrowRightOnRectangle,
      heroRectangleStack,
      heroAcademicCap,
      heroBeaker,
    }),
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  protected readonly ButtonStyle = ButtonStyle
  protected readonly UserRoles = UserRoles

  showAppUi$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(() => {
      let route: ActivatedRouteSnapshot | null =
        this.router.routerState.root.snapshot

      do {
        const data: StochusRouteData | undefined = route?.data
        if (data.hideAppUi) {
          return false
        }

        route = route?.firstChild ?? null
      } while (route)

      return true
    }),
  )

  isStudent$ = this.userService.userHasRole(UserRoles.STUDENT)
  isResearcher$ = this.userService.userHasRole(UserRoles.RESEARCHER)
  hasActiveStudies$ = this.isStudent$.pipe(
    switchMap((isStudent) =>
      isStudent ? this.studyService.hasActiveStudies() : of(false),
    ),
  )
  canChooseTasksFreely$ = this.hasActiveStudies$.pipe(map((x) => !x))

  constructor(
    private readonly router: Router,
    private readonly keycloakService: KeycloakService,
    private readonly toastService: ToastService,
    private readonly userService: UserService,
    private readonly studyService: StudiesService,
  ) {}

  logout() {
    this.keycloakService.logout(window.location.origin).catch((e) => {
      console.error(e)
      this.toastService.error('Abmelden fehlgeschlagen')
    })
  }
}
