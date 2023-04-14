import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router'
import { filter, map } from 'rxjs'
import { StochusRouteData } from '../app.routes'
import { KeycloakService } from 'keycloak-angular'
import {
  ButtonComponent,
  ButtonStyle,
  DropdownComponent,
  MenuComponent,
  MenuItemComponent,
  NavbarCenterComponent,
  NavbarComponent as DaisyNavbarComponent,
  NavbarEndComponent,
  NavbarStartComponent,
  ToastService,
} from '@stochus/daisy-ui'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import {
  heroBars3,
  heroArrowRightOnRectangle,
} from '@ng-icons/heroicons/outline'

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
  providers: [provideIcons({ heroBars3, heroArrowRightOnRectangle })],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  protected readonly ButtonStyle = ButtonStyle

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

  constructor(
    private readonly router: Router,
    private readonly keycloakService: KeycloakService,
    private readonly toastService: ToastService,
  ) {}

  logout() {
    this.keycloakService.logout(window.location.origin).catch((e) => {
      console.error(e)
      this.toastService.error('Abmelden fehlgeschlagen')
    })
  }
}
