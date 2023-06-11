import { KeycloakEventType, KeycloakService } from 'keycloak-angular'

export const initKeycloak = (keycloak: KeycloakService) => () => {
  const result = keycloak.init({
    config: {
      url: 'http://localhost:8080/',
      realm: 'stochus',
      clientId: 'stochus-frontend',
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
