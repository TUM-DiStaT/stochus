import { NgModule } from '@angular/core'
import { KeycloakService } from 'keycloak-angular'
import { KeycloakServiceMock } from './KeycloakServiceMock'

@NgModule({
  providers: [
    {
      provide: KeycloakService,
      useClass: KeycloakServiceMock,
    },
  ],
})
export class KeycloakTestingModule {}
