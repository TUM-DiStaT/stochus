import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { KeycloakTokenParsed } from 'keycloak-js'
import { META_ROLES, RoleMatchingMode } from 'nest-keycloak-connect'
import { RoleDecoratorOptionsInterface } from 'nest-keycloak-connect/interface/role-decorator-options.interface'
import { extractRequest } from 'nest-keycloak-connect/util.js'

@Injectable()
export class MockRoleGuard implements CanActivate {
  private readonly logger = new Logger(MockRoleGuard.name)

  constructor(private readonly reflector: Reflector) {}

  // Code mostly stolen from
  // https://github.com/ferrerojosh/nest-keycloak-connect/blob/master/src/guards/role.guard.ts
  canActivate(context: ExecutionContext): boolean {
    const rolesMetaDatas: RoleDecoratorOptionsInterface[] = []

    const roleDecoratorMetaData =
      this.reflector.getAllAndOverride<RoleDecoratorOptionsInterface>(
        META_ROLES,
        [context.getClass(), context.getHandler()],
      )

    if (roleDecoratorMetaData) {
      rolesMetaDatas.push(roleDecoratorMetaData)
    }

    const combinedRoles = rolesMetaDatas.flatMap((x) => x.roles)

    if (combinedRoles.length === 0) {
      return true
    }

    // Use matching mode of first item
    const roleMetaData = rolesMetaDatas[0]
    const roleMatchingMode = roleMetaData.mode
      ? roleMetaData.mode
      : RoleMatchingMode.ANY

    this.logger.verbose(`Using matching mode: ${roleMatchingMode}`)
    this.logger.verbose(`Roles: ${JSON.stringify(combinedRoles)}`)

    // Extract request
    const [request] = extractRequest(context)
    // if is not an HTTP request ignore this guard
    if (!request) {
      return true
    }

    const user: KeycloakTokenParsed = request.user

    if (!user) {
      // No access token attached, auth guard should have attached the necessary token
      this.logger.warn(
        'No access token found in request, are you sure AuthGuard is first in the chain?',
      )
      return false
    }

    // For verbose logging, we store it instead of returning it immediately
    const granted =
      roleMatchingMode === RoleMatchingMode.ANY
        ? combinedRoles.some(
            (r) =>
              user.realm_access?.roles.includes(r.replace('realm:', '')) ??
              false,
          )
        : combinedRoles.every(
            (r) =>
              user.realm_access?.roles.includes(r.replace('realm:', '')) ??
              false,
          )

    if (granted) {
      this.logger.verbose(`Resource granted due to role(s)`)
    } else {
      this.logger.verbose(`Resource denied due to mismatched role(s)`)
    }

    return granted
  }
}
