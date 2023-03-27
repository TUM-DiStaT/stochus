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
        // TODO: remove console logs
        console.log('Refreshing token')
        await keycloak.updateToken(20)
        console.log(
          `Refresing finished. New token: ${await keycloak.getToken()}`,
        )
      }
    },
  })

  return result
}
