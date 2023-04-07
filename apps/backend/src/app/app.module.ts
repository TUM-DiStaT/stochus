import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BackendAuthModule } from '@stochus/auth/backend'

@Module({
  imports: [BackendAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
