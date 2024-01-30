import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserRoles } from '@stochus/auth/shared'
import { RealmRoles } from '../realm-roles.decorator'
import { KeycloakAdminService } from './keycloak-admin.service'

@Controller('keycloak-admin')
@ApiTags('keycloak-admin')
export class KeycloakAdminController {
  constructor(private keycloakAdminService: KeycloakAdminService) {}

  @Get('groups')
  // TODO: write test to ensure auth check!
  @RealmRoles({ roles: [UserRoles.RESEARCHER] })
  async getGroups() {
    return await this.keycloakAdminService.getGroups()
  }
}
