import { Controller, Get, Logger } from '@nestjs/common'

import { AppService } from './app.service'
import { ParsedUser } from '@stochus/auth/backend'
import { User } from '@stochus/auth/shared'
import { Public } from 'nest-keycloak-connect'

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)

  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @Public()
  getData(@ParsedUser() user?: User) {
    this.logger.debug(user)
    return this.appService.getData(user?.id ?? 'anonymous')
  }
}
