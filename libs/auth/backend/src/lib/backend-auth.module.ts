import { Module, Global } from '@nestjs/common'
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  ResourceGuard,
  RoleGuard,
  TokenValidation,
} from 'nest-keycloak-connect'
import { APP_GUARD } from '@nestjs/core'

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
