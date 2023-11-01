import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  ResourceGuard,
  RoleGuard,
  TokenValidation,
} from 'nest-keycloak-connect'
import { KeycloakAdminController } from './keycloak-admin/keycloak-admin.controller'
import { KeycloakAdminService } from './keycloak-admin/keycloak-admin.service'

const keycloakUrl = 'http://localhost:8080'
const realm = 'stochus'
const clientId = 'stochus-backend'
const secret = 'LnhgXGiBrlvXbMWRNo8I6E4ha9u58yBv'

const keycloakModule = KeycloakConnectModule.register({
  authServerUrl: keycloakUrl,
  realm,
  secret: secret,
  clientId: clientId,
  policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
  tokenValidation: TokenValidation.ONLINE,
})

@Global()
@Module({
  imports: [keycloakModule],
  controllers: [KeycloakAdminController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    KeycloakAdminService,
  ],
  exports: [keycloakModule, KeycloakAdminService],
})
export class BackendAuthModule {}
