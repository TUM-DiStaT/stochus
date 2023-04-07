import { NxWelcomeComponent } from './nx-welcome.component'
import { RouterModule } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { KeycloakService } from 'keycloak-angular'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Subject } from 'rxjs'
import { AsyncPipe, JsonPipe } from '@angular/common'

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

  constructor(
    private readonly keycloak: KeycloakService,
    private readonly http: HttpClient,
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
