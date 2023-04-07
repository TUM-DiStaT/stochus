import { NgModule } from '@angular/core'
import { KeycloakServiceMock } from './KeycloakServiceMock'
import { KeycloakService } from 'keycloak-angular'

@NgModule({
  providers: [
    {
      provide: KeycloakService,
      useClass: KeycloakServiceMock,
    },
  ],
})
export class KeycloakTestingModule {}
