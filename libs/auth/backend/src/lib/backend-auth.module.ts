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
import {
  AppConfigurationModule,
  AppConfigurationService,
} from '@stochus/core/backend'
import { KeycloakAdminController } from './keycloak-admin/keycloak-admin.controller'
import { KeycloakAdminService } from './keycloak-admin/keycloak-admin.service'

const keycloakModule = KeycloakConnectModule.registerAsync({
  imports: [AppConfigurationModule],
  inject: [AppConfigurationService],
  useFactory: (appConfigService: AppConfigurationService) => ({
    authServerUrl: appConfigService.keycloakOrigin,
    realm: appConfigService.keycloakRealm,
    secret: appConfigService.keycloakClientSecret,
    clientId: appConfigService.keycloakClientId,

    policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
    tokenValidation: TokenValidation.ONLINE,
  }),
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
