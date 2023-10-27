import { Module } from '@nestjs/common'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import { AssignmentsCoreBackendModule } from '@stochus/assignments/core/backend'
import { BackendAuthModule } from '@stochus/auth/backend'
import {
  AppConfigurationModule,
  AppConfigurationService,
} from '@stochus/core/backend'
import { InteractionLogsModule } from '@stochus/interaction-logs/backend'
import { StudiesBackendModule } from '@stochus/studies/backend'

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
    AssignmentsCoreBackendModule,
    StudiesBackendModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
