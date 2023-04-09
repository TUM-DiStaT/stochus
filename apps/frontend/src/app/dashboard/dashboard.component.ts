import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { KeycloakService } from 'keycloak-angular'
import { ButtonComponent } from '@stochus/daisy-ui'

@Component({
  selector: 'stochus-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  constructor(private readonly keycloakService: KeycloakService) {}

  logout() {
    this.keycloakService.logout(window.location.origin).catch(console.error)
  }
}
