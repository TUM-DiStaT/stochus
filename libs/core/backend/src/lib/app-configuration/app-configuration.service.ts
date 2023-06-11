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

  constructor(private readonly configService: ConfigService) {}
}
