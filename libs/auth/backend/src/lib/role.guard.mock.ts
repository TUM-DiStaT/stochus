import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'
import { extractRequest } from 'nest-keycloak-connect/util'
import { KeycloakTokenParsed } from 'keycloak-js'
import { parseUser, UserRoles } from '@stochus/auth/shared'

export class MockRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const [request] = extractRequest(context)
    const userToken: KeycloakTokenParsed = request.user
    if (!userToken) {
      throw new UnauthorizedException()
    }
    const user = parseUser(userToken)
    if (!user.roles.includes(UserRoles.STUDENT)) {
      throw new ForbiddenException()
    }

    return true
  }
}
