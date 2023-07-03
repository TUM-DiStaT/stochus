import { Controller, Get, Logger } from '@nestjs/common'
import { User } from '@stochus/auth/shared'
import { ParsedUser } from '@stochus/auth/backend'
import { AppService } from './app.service'

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
