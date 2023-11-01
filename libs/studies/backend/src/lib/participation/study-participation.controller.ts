import { Controller, Get, Logger, Param, Post } from '@nestjs/common'
import { User, UserRoles } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { StudyParticipationWithAssignmentCompletionsDto } from '@stochus/studies/shared'
import { ParsedUser, RealmRoles } from '@stochus/auth/backend'
import { StudyParticipationBackendService } from './study-participation-backend.service'

@Controller('studies/participate')
export class StudyParticipationController {
  private readonly logger = new Logger(StudyParticipationController.name)

  constructor(
    private readonly studyParticipationService: StudyParticipationBackendService,
  ) {}

  @Get(':studyId')
  @RealmRoles({ roles: [UserRoles.STUDENT] })
  async get(@ParsedUser() user: User, @Param('studyId') studyId: string) {
    const result = this.studyParticipationService.getActiveParticipation(
      user,
      studyId,
    )
    return plainToInstance(
      StudyParticipationWithAssignmentCompletionsDto,
      result,
    )
  }

  @Post(':studyId')
  @RealmRoles({ roles: [UserRoles.STUDENT] })
  async create(@ParsedUser() user: User, @Param('studyId') studyId: string) {
    this.logger.verbose(`Creating a new participation for ${studyId}`)
    const result = this.studyParticipationService.createParticipation(
      user,
      studyId,
    )
    return plainToInstance(
      StudyParticipationWithAssignmentCompletionsDto,
      result,
    )
  }
}
