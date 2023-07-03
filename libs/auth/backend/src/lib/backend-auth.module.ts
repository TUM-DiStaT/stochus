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

const keycloakModule = KeycloakConnectModule.register({
  authServerUrl: 'http://localhost:8080',
  realm: 'stochus',
  secret: 'LnhgXGiBrlvXbMWRNo8I6E4ha9u58yBv',
  clientId: 'stochus-backend',
  policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
  tokenValidation: TokenValidation.ONLINE,
})

@Global()
@Module({
  imports: [keycloakModule],
  controllers: [],
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
  ],
  exports: [keycloakModule],
})
export class BackendAuthModule {}
