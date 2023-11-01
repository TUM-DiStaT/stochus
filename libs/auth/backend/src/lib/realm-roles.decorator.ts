import { SetMetadata } from '@nestjs/common'
import { META_ROLES } from 'nest-keycloak-connect'
import { RoleDecoratorOptionsInterface } from 'nest-keycloak-connect/interface/role-decorator-options.interface'

export const RealmRoles = (roleMetadata: RoleDecoratorOptionsInterface) =>
  SetMetadata(META_ROLES, {
    ...roleMetadata,
    roles: roleMetadata.roles.map((role) => `realm:${role}`),
  })
