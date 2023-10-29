import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { Types } from 'mongoose'
import { User, UserRoles } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import {
  StudyCreateDto,
  StudyDto,
  StudyUpdateDto,
} from '@stochus/studies/shared'
import { ParsedUser, RealmRoles } from '@stochus/auth/backend'
import { StudiesBackendService } from './studies-backend.service'

// class DeleteParams {
//   @IsMongoId()
//   @IsNotEmpty()
//   id!: string
// }

@Controller('studies')
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
    // TODO: WTF
    // @Param() params: DeleteParams,
    @Param('id') id: string,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`${id} is not a valid Mongo ID`)
    }
    return plainToInstance(
      StudyDto,
      await this.studiesService.getById(id, user),
    )
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
    // TODO: WTF
    // @Param() params: DeleteParams,
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
    // TODO: WTF
    // @Param() params: DeleteParams,
    @Param('id') id: string,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`${id} is not a valid Mongo ID`)
    }
    await this.studiesService.delete(id, user)
  }
}
