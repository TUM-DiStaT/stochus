interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
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

const importMeta = import.meta as unknown as ImportMeta

const getValue = (key: keyof ImportMetaEnv): string => {
  if (!importMeta.env[key]) {
    throw new Error(`Environment variable ${key} is not set`)
  }
  return importMeta.env[key]
}

export const frontendEnvironment = {
  keycloakUrl: getValue('NG_APP_KEYCLOAK_URL'),
  keycloakRealm: getValue('NG_APP_KEYCLOAK_REALM'),
  keycloakClientId: getValue('NG_APP_KEYCLOAK_CLIENT_ID'),
}
