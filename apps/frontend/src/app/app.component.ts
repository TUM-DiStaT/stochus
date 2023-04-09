import { NxWelcomeComponent } from './nx-welcome.component'
import {
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { KeycloakService } from 'keycloak-angular'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { filter, map, Subject } from 'rxjs'
import { AsyncPipe, JsonPipe } from '@angular/common'
import { StochusRouteData } from './app.routes'

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    AsyncPipe,
    HttpClientModule,
    JsonPipe,
  ],
  selector: 'stochus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'frontend'
  hello$ = new Subject()
  hideAppUi$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(() => {
      let route: ActivatedRouteSnapshot | null =
        this.router.routerState.root.snapshot

      do {
        const data: StochusRouteData | undefined = route?.data
        if (data.hideAppUi) {
          return true
        }

        route = route?.firstChild ?? null
      } while (route)

      return false
    }),
  )

  constructor(
    private readonly keycloak: KeycloakService,
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.getData()
  }

  getData() {
    this.http.get('/api/hello').subscribe(this.hello$)
  }

  login() {
    this.keycloak.login({
      redirectUri: window.location.origin,
    })
  }

  logout() {
    this.keycloak.logout()
  }
}
