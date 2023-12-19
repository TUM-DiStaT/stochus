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
  async createAssignmentCompletionLog(
    @Body() dto: InteractionLogCreateDto,
    @ParsedUser() user: User,
    @Param('assignmentCompletionId') assignmentCompletionId: string,
  ) {
    const entry =
      await this.interactionLogsBackendService.createNewAssignmentCompletionLogEntry(
        dto,
        user,
        assignmentCompletionId,
      )

    return plainToInstance(InteractionLogDto, entry)
  }

  @Post('study-participation/:studyParticipationId')
  @RealmRoles({ roles: [UserRoles.STUDENT] })
  async createGeneralStudyParticipationLog(
    @Body() dto: InteractionLogCreateDto,
    @ParsedUser() user: User,
    @Param('studyParticipationId') studyParticipationId: string,
  ) {
    const entry =
      await this.interactionLogsBackendService.createNewStudyParticipationLogEntry(
        dto,
        user,
        studyParticipationId,
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
