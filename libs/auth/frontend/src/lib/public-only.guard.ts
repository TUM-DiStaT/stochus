import { Injectable } from '@angular/core'
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular'
import { Router, UrlTree } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class PublicOnlyGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService,
  ) {
    super(router, keycloak)
  }

  override async isAccessAllowed(): Promise<boolean | UrlTree> {
    if (this.authenticated) {
      await this.router.navigate(['dashboard'])
      return false
    }

    return true
  }
}
