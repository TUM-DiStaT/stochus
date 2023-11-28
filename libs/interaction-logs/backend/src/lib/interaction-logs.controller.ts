import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { User, UserRoles } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { ParsedUser, RealmRoles } from '@stochus/auth/backend'
import {
  InteractionLogCreateDto,
  InteractionLogDto,
} from '@stochus/interaction-logs/dtos'
import { InteractionLogsService } from './interaction-logs.service'

@Controller('interaction-logs')
export class InteractionLogsController {
  constructor(private interactionLogsBackendService: InteractionLogsService) {}

  @Post('assignment-completion/:assignmentCompletionId')
  @RealmRoles({ roles: [UserRoles.STUDENT] })
  async createLog(
    @Body() dto: InteractionLogCreateDto,
    @ParsedUser() user: User,
    @Param('assignmentCompletionId') assignmentCompletionId: string,
  ) {
    const entry = await this.interactionLogsBackendService.createNewLogEntry(
      dto,
      user,
      assignmentCompletionId,
    )

    return plainToInstance(InteractionLogDto, entry)
  }

  @Get()
  @RealmRoles({ roles: [UserRoles.RESEARCHER] })
  async getAllLogs() {
    const logs = await this.interactionLogsBackendService.getAll()
    return plainToInstance(InteractionLogDto, logs)
  }
}
