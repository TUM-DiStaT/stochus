import { Injectable } from '@angular/core'
import { KeycloakService } from 'keycloak-angular'
import { parseUser, User } from '@stochus/auth/shared'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly keycloakService: KeycloakService) {}

  getUser(): User | undefined {
    const dataFromToken = this.keycloakService.getKeycloakInstance().tokenParsed
    return dataFromToken ? parseUser(dataFromToken) : undefined
  }
}
