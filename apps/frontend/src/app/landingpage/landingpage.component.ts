import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { KeycloakService } from 'keycloak-angular'
import {
  ButtonColor,
  ButtonComponent,
  ButtonSize,
  ButtonStyle,
} from '@stochus/daisy-ui'

@Component({
  selector: 'stochus-landingpage',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './landingpage.component.html',
})
export class LandingpageComponent {
  protected readonly ButtonColor = ButtonColor
  protected readonly ButtonStyle = ButtonStyle
  protected readonly ButtonSize = ButtonSize

  constructor(private readonly keycloakService: KeycloakService) {}

  login() {
    // this.keycloakService.logout().catch(console.error)
    this.keycloakService
      .login({
        redirectUri: window.location.origin,
      })
      .catch(console.error)
  }
}
