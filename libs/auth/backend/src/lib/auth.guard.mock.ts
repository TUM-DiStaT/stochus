import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { KeycloakTokenParsed } from 'keycloak-js'
import { extractRequest } from 'nest-keycloak-connect/util'
import { User, userToKeycloakTokenParsed } from '@stochus/auth/shared'

let counter = 0

export class MockAuthGuard implements CanActivate {
  private user?: KeycloakTokenParsed
  private counter = counter++

  setCurrentUser(user?: User) {
    this.user = user ? userToKeycloakTokenParsed(user) : undefined
    console.log(`${this.counter} - RESETTING USER`, user)
  }

  canActivate(context: ExecutionContext): Promise<boolean> {
    console.log(`${this.counter} - canactivate - `, { user: this.user })

    if (!this.user) {
      throw new UnauthorizedException()
    }

    // Attach current user to request. Might be needed for @ParsedUser pipe.
    const [request] = extractRequest(context)
    request.user = this.user

    return Promise.resolve(true)
  }
}
