import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { User, UserRoles } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import {
  StudyCreateDto,
  StudyDto,
  StudyFeedbackDto,
  StudyForDownloadDto,
  StudyForParticipationDto,
  StudyUpdateDto,
} from '@stochus/studies/shared'
import { ParsedUser, RealmRoles } from '@stochus/auth/backend'
import { StudiesBackendService } from './studies-backend.service'

@Controller('studies')
@ApiTags('studies')
export class StudiesBackendController {
  private readonly logger = new Logger(StudiesBackendController.name)

  constructor(private readonly studiesService: StudiesBackendService) {
    this.logger.debug('Created instance')
  }

  @Get('manage')
  @RealmRoles({ roles: [UserRoles.RESEARCHER] })
  async getAllByOwner(
    @ParsedUser()
    user: User,
  ) {
    return plainToInstance(StudyDto, this.studiesService.getAllByOwner(user))
  }

  @Get('manage/:id')
  @RealmRoles({ roles: [UserRoles.RESEARCHER] })
  async getById(
    @ParsedUser()
    user: User,
    @Param('id') id: string,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`${id} is not a valid Mongo ID`)
    }

    const study = await this.studiesService.getById(id)

    if (study.ownerId !== user.id) {
      throw new ForbiddenException()
    }

    return plainToInstance(StudyDto, study)
  }

  @Post('manage')
  @RealmRoles({ roles: [UserRoles.RESEARCHER] })
  async create(
    @ParsedUser()
    user: User,
    @Body()
    dto: StudyCreateDto,
  ) {
    return plainToInstance(StudyDto, this.studiesService.create(dto, user))
  }

  @Put('manage/:id')
  @RealmRoles({ roles: [UserRoles.RESEARCHER] })
  async update(
    @ParsedUser()
    user: User,
    @Param('id') id: string,
    @Body()
    dto: StudyUpdateDto,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`${id} is not a valid Mongo ID`)
    }
    return plainToInstance(StudyDto, this.studiesService.update(id, dto, user))
  }

  @Delete('manage/:id')
  @RealmRoles({ roles: [UserRoles.RESEARCHER] })
  async delete(
    @ParsedUser()
    user: User,
    @Param('id') id: string,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`${id} is not a valid Mongo ID`)
    }
    await this.studiesService.delete(id, user)
  }

  @Get('participate')
  @RealmRoles({ roles: [UserRoles.STUDENT] })
  async getAllForStudent(@ParsedUser() user: User) {
    const allForCurrentStudent =
      await this.studiesService.getAllForCurrentStudent(user)
    return plainToInstance(StudyForParticipationDto, allForCurrentStudent)
  }

  @Get('participate/forFeedback/:id')
  @RealmRoles({ roles: [UserRoles.STUDENT] })
  async getForFeedback(@ParsedUser() user: User, @Param('id') id: string) {
    const study = await this.studiesService.getByIdForStudent(id, user)
    return plainToInstance(StudyFeedbackDto, study)
  }

  @Get('download/:id')
  @RealmRoles({ roles: [UserRoles.RESEARCHER] })
  async getAllDataForDownload(
    @ParsedUser()
    user: User,
    @Param('id') id: string,
  ) {
    return plainToInstance(
      StudyForDownloadDto,
      await this.studiesService.getForDownload(id, user),
    )
  }
}
