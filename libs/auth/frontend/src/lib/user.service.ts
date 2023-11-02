import { Injectable } from '@angular/core'
import { KeycloakService } from 'keycloak-angular'
import {
  concat,
  distinctUntilChanged,
  interval,
  map,
  of,
  shareReplay,
} from 'rxjs'
import { User, UserRoles, parseUser } from '@stochus/auth/shared'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly user$

  constructor(private readonly keycloakService: KeycloakService) {
    const updates$ = interval(1_000).pipe(
      map(() => this.keycloakService.getKeycloakInstance()),
    )

    this.user$ = concat(
      of(this.keycloakService.getKeycloakInstance()),
      updates$,
    ).pipe(
      distinctUntilChanged(),
      map((keycloak) =>
        keycloak.tokenParsed ? parseUser(keycloak.tokenParsed) : undefined,
      ),
      shareReplay(),
    )
  }

  getUser(): User | undefined {
    const dataFromToken = this.keycloakService.getKeycloakInstance().tokenParsed
    return dataFromToken ? parseUser(dataFromToken) : undefined
  }

  userHasRole(role: UserRoles) {
    return this.user$.pipe(
      map((user) => user?.roles.includes(role) ?? false),
      distinctUntilChanged(),
    )
  }
}
