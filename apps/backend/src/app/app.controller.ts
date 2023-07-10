import { Controller, Get } from '@nestjs/common'
import { User } from '@stochus/auth/shared'
import { ParsedUser } from '@stochus/auth/backend'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getData(@ParsedUser() user: User) {
    return this.appService.getData(user.id ?? 'anonymous')
  }
}
