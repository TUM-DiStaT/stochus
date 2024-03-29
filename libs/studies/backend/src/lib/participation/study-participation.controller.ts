import { Controller, Get, Logger, Param, Post } from '@nestjs/common'
import { ApiProperty, ApiTags } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsMongoId } from 'class-validator'
import { User, UserRoles } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { StudyParticipationWithAssignmentCompletionsDto } from '@stochus/studies/shared'
import { ParsedUser, RealmRoles } from '@stochus/auth/backend'
import { StudyParticipationBackendService } from './study-participation-backend.service'

class StudyIdParams {
  @Expose()
  @IsMongoId()
  @ApiProperty()
  studyId!: string
}

@Controller('studies/participate')
@ApiTags('study-participation')
export class StudyParticipationController {
  private readonly logger = new Logger(StudyParticipationController.name)

  constructor(
    private readonly studyParticipationService: StudyParticipationBackendService,
  ) {}

  @Get(':studyId')
  @RealmRoles({ roles: [UserRoles.STUDENT] })
  async get(@ParsedUser() user: User, @Param() params: StudyIdParams) {
    const result = this.studyParticipationService.getActiveParticipation(
      user,
      params.studyId,
    )
    return plainToInstance(
      StudyParticipationWithAssignmentCompletionsDto,
      result,
    )
  }

  @Post(':studyId')
  @RealmRoles({ roles: [UserRoles.STUDENT] })
  async create(@ParsedUser() user: User, @Param() params: StudyIdParams) {
    this.logger.verbose(`Creating a new participation for ${params.studyId}`)
    const result = await this.studyParticipationService.createParticipation(
      user,
      params.studyId,
    )
    return plainToInstance(
      StudyParticipationWithAssignmentCompletionsDto,
      result,
    )
  }
}
