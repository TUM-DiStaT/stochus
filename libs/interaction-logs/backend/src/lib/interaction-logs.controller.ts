import { Body, Controller, Post } from '@nestjs/common'
import { InteractionLogsService } from './interaction-logs.service'
import { plainToInstance } from 'class-transformer'
import {
  InteractionLogCreateDto,
  InteractionLogDto,
} from '@stochus/interaction-logs/dtos'
import { ParsedUser } from '@stochus/auth/backend'
import { User } from '@stochus/auth/shared'

@Controller('interaction-logs')
export class InteractionLogsController {
  constructor(private interactionLogsBackendService: InteractionLogsService) {}

  @Post()
  async createLog(
    @Body() dto: InteractionLogCreateDto,
    @ParsedUser() user: User,
  ) {
    const entry = await this.interactionLogsBackendService.createNewLogEntry(
      dto,
      user,
    )

    return plainToInstance(InteractionLogDto, entry, {
      excludeExtraneousValues: true,
    })
  }
}
