import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common'
import { Types } from 'mongoose'
import { User, UserRoles } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { StudyCreateDto, StudyDto } from '@stochus/studies/shared'
import { ParsedUser, RealmRoles } from '@stochus/auth/backend'
import { StudiesBackendService } from './studies-backend.service'

// class DeleteParams {
//   @IsMongoId()
//   @IsNotEmpty()
//   id!: string
// }

@Controller('studies/manage')
export class StudiesBackendController {
  private readonly logger = new Logger(StudiesBackendController.name)

  constructor(private readonly studiesService: StudiesBackendService) {
    this.logger.debug('Created instance')
  }

  @Get()
  @RealmRoles({ roles: [UserRoles.RESEARCHER] })
  async getAllByOwner(
    @ParsedUser()
    user: User,
  ) {
    return plainToInstance(StudyDto, this.studiesService.getAllByOwner(user))
  }

  @Post()
  @RealmRoles({ roles: [UserRoles.RESEARCHER] })
  async create(
    @ParsedUser()
    user: User,
    @Body()
    dto: StudyCreateDto,
  ) {
    return plainToInstance(StudyDto, this.studiesService.create(dto, user))
  }

  @Delete(':id')
  @RealmRoles({ roles: [UserRoles.RESEARCHER] })
  async delete(
    @ParsedUser()
    user: User,
    // @Param() params: DeleteParams,
    @Param('id') id: string,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`${id} is not a valid Mongo ID`)
    }
    await this.studiesService.delete(id, user)
  }
}
