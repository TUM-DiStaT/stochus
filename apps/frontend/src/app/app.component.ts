import { NxWelcomeComponent } from './nx-welcome.component'
import { RouterModule } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { KeycloakService } from 'keycloak-angular'

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'stochus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'frontend'

  constructor(private keycloak: KeycloakService) {}

  ngOnInit() {
    this.keycloak.getKeycloakInstance().loadUserProfile().then(console.log)
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
