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
  heroArrowRightOnRectangle,
  heroBars3,
  heroRectangleStack,
} from '@ng-icons/heroicons/outline'
import { KeycloakService } from 'keycloak-angular'
import { filter, map } from 'rxjs'
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
    provideIcons({ heroBars3, heroArrowRightOnRectangle, heroRectangleStack }),
  ],
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
