import { Injectable } from '@angular/core'
import { KeycloakService } from 'keycloak-angular'

@Injectable()
export class KeycloakServiceMock extends KeycloakService {}
