import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppConfigurationService {
  public readonly mongodbConnectionString =
    this.configService.getOrThrow<string>('MONGO_DB_URI')
  public readonly mongodbUsername =
    this.configService.getOrThrow<string>('MONGO_DB_USERNAME')
  public readonly mongodbPassword =
    this.configService.getOrThrow<string>('MONGO_DB_PASSWORD')
  public readonly mongoDbName =
    this.configService.getOrThrow<string>('MONGO_DB_DB_NAME')

  public readonly keycloakOrigin =
    this.configService.getOrThrow<string>('KEYCLOAK_ORIGIN')
  public readonly keycloakRealm =
    this.configService.getOrThrow<string>('KEYCLOAK_REALM')
  public readonly keycloakClientId = this.configService.getOrThrow<string>(
    'KEYCLOAK_BACKEND_CLIENT_ID',
  )
  public readonly keycloakClientSecret = this.configService.getOrThrow<string>(
    'KEYCLOAK_BACKEND_CLIENT_SECRET',
  )

  constructor(private readonly configService: ConfigService) {}
}
