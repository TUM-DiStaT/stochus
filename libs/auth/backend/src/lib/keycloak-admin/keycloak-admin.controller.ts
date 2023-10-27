import { Controller, Get } from '@nestjs/common'
import { UserRoles } from '@stochus/auth/shared'
import { RealmRoles } from '../realm-roles.decorator'
import { KeycloakAdminService } from './keycloak-admin.service'

@Controller('keycloak-admin')
export class KeycloakAdminController {
  constructor(private keycloakAdminService: KeycloakAdminService) {}

  @Get('groups')
  @RealmRoles({ roles: [UserRoles.RESEARCHER] })
  async getGroups() {
    return await this.keycloakAdminService.getGroups()
  }
}
