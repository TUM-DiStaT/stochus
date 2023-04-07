import { Controller, Get, Logger } from '@nestjs/common'

import { AppService } from './app.service'
import { ParsedUser } from '@stochus/auth/backend'
import { User } from '@stochus/auth/shared'

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)

  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getData(@ParsedUser() user: User) {
    this.logger.debug(user)
    return this.appService.getData(user.id ?? 'anonymous')
  }
}
