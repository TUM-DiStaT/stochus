import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppConfigurationService } from './app-configuration.service'

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [AppConfigurationService],
  exports: [AppConfigurationService],
})
export class AppConfigurationModule {}
