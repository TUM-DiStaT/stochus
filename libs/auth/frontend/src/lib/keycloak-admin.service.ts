import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import GroupRepresentation from '@keycloak/keycloak-admin-client/lib/defs/groupRepresentation'

@Injectable({
  providedIn: 'root',
})
export class KeycloakAdminService {
  private static readonly baseUrl = '/api/keycloak-admin'

  constructor(private http: HttpClient) {}

  getGroups() {
    return this.http.get<GroupRepresentation[]>(
      KeycloakAdminService.baseUrl + '/groups',
    )
  }
}
