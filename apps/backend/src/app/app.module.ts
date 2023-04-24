import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BackendAuthModule } from '@stochus/auth/backend'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import {
  AppConfigurationModule,
  AppConfigurationService,
} from '@stochus/core/backend'
import { InteractionLogsModule } from '@stochus/interaction-logs/backend'

@Module({
  imports: [
    AppConfigurationModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigurationModule],
      inject: [AppConfigurationService],
      useFactory: (
        appConfigService: AppConfigurationService,
      ): MongooseModuleOptions => {
        return {
          uri: appConfigService.mongodbConnectionString,
          auth: {
            username: appConfigService.mongodbUsername,
            password: appConfigService.mongodbPassword,
          },
          dbName: appConfigService.mongoDbName,
        }
      },
    }),
    BackendAuthModule,
    InteractionLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
