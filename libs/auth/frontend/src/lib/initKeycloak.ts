import { KeycloakEventType, KeycloakService } from 'keycloak-angular'
import { frontendEnvironment } from '@stochus/core/frontend'

export const initKeycloak = (keycloak: KeycloakService) => () => {
  const result = keycloak.init({
    config: {
      url: frontendEnvironment.keycloakUrl,
      realm: frontendEnvironment.keycloakRealm,
      clientId: frontendEnvironment.keycloakClientId,
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri:
        window.location.origin + '/assets/silent-check-sso.html',
    },
  })

  // Auto-refresh token
  keycloak.keycloakEvents$.subscribe({
    next: async (event) => {
      if (event.type === KeycloakEventType.OnTokenExpired) {
        await keycloak.updateToken(20)
      }
    },
  })

  return result
}
