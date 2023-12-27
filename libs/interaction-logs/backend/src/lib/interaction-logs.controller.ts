import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { Expose } from 'class-transformer'
import { IsMongoId } from 'class-validator'
import { User, UserRoles } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { ParsedUser, RealmRoles } from '@stochus/auth/backend'
import {
  InteractionLogCreateDto,
  InteractionLogDto,
} from '@stochus/interaction-logs/dtos'
import { InteractionLogsService } from './interaction-logs.service'

class CreateGeneralStudyParticipationLogParams {
  @Expose()
  @IsMongoId()
  studyParticipationId!: string
}

class CreateGeneralAssignmentCompletionLogParams {
  @Expose()
  @IsMongoId()
  assignmentCompletionId!: string
}

@Controller('interaction-logs')
export class InteractionLogsController {
  constructor(private interactionLogsBackendService: InteractionLogsService) {}

  @Post('assignment-completion/:assignmentCompletionId')
  @RealmRoles({ roles: [UserRoles.STUDENT] })
  async createAssignmentCompletionLog(
    @Body() dto: InteractionLogCreateDto,
    @ParsedUser() user: User,
    @Param() params: CreateGeneralAssignmentCompletionLogParams,
  ) {
    const entry =
      await this.interactionLogsBackendService.createNewAssignmentCompletionLogEntry(
        dto,
        user,
        params.assignmentCompletionId,
      )

    return plainToInstance(InteractionLogDto, entry)
  }

  @Post('study-participation/:studyParticipationId')
  @RealmRoles({ roles: [UserRoles.STUDENT] })
  async createGeneralStudyParticipationLog(
    @Body() dto: InteractionLogCreateDto,
    @ParsedUser() user: User,
    @Param() params: CreateGeneralStudyParticipationLogParams,
  ) {
    const entry =
      await this.interactionLogsBackendService.createNewStudyParticipationLogEntry(
        dto,
        user,
        params.studyParticipationId,
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
