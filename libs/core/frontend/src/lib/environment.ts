declare const process: {
  env: {
    /**
     * Built-in environment variable.
     * @see Docs https://github.com/chihab/dotenv-run/packages/angular#ng_app_env.
     */
    readonly NG_APP_ENV: string
    // Add your environment variables below
    readonly NG_APP_KEYCLOAK_URL: string
    readonly NG_APP_KEYCLOAK_REALM: string
    readonly NG_APP_KEYCLOAK_CLIENT_ID: string
  }
}

const guaranteeExists = (value?: string): string => {
  if (value === undefined) {
    throw new Error(`Environment variable is not set`)
  }
  return value
}

export const getFrontendEnvironment = () => ({
  keycloakUrl: guaranteeExists(process.env.NG_APP_KEYCLOAK_URL),
  keycloakRealm: guaranteeExists(process.env.NG_APP_KEYCLOAK_REALM),
  keycloakClientId: guaranteeExists(process.env.NG_APP_KEYCLOAK_CLIENT_ID),
})
