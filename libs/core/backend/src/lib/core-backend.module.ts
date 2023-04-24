import { Module } from '@nestjs/common'
import { AppConfigurationModule } from './app-configuration/app-configuration.module'

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [AppConfigurationModule],
})
export class CoreBackendModule {}
