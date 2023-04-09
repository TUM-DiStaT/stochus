import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { KeycloakService } from 'keycloak-angular'
import {
  ButtonColor,
  ButtonComponent,
  ButtonSize,
  ButtonStyle,
  ToastService,
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

  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly toastService: ToastService,
  ) {}

  login() {
    this.keycloakService
      .login({
        redirectUri: window.location.origin + '/dashboard',
      })
      .catch((e) => {
        console.error(e)
        this.toastService.error('Login fehlgeschlagen')
      })
  }
}
