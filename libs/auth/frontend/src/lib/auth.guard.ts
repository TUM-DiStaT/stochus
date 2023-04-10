import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular'
import { isValidRoles, UserRoles } from '@stochus/auth/shared'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService,
  ) {
    super(router, keycloak)
  }

  override async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      })
      return false
    }

    const requiredRoles: UserRoles[] | undefined = route.data?.['roles']

    if (!Array.isArray(requiredRoles) || requiredRoles.length <= 0) {
      return true
    }

    if (!isValidRoles(requiredRoles)) {
      throw new Error('Route requires invalid roles!')
    }

    if (!this.roles) {
      return false
    }

    if (!requiredRoles.every((role) => this.roles.includes(role))) {
      await this.router.navigate([''])
      return false
    }

    return true
  }
}
