import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common'
import { AuthGuard, RoleGuard, Roles } from 'nest-keycloak-connect'
import { User, UserRoles } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { StudyCreateDto, StudyDto } from '@stochus/studies/shared'
import { ParsedUser } from '@stochus/auth/backend'
import { StudiesBackendService } from './studies-backend.service'

@Controller('studies/manage')
export class StudiesBackendController {
  private readonly logger = new Logger(StudiesBackendController.name)

  constructor(private readonly studiesService: StudiesBackendService) {
    this.logger.debug('Created instance', this.studiesService)
  }

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles({ roles: [UserRoles.RESEARCHER] })
  async getAllByOwner(
    @ParsedUser()
    user: User,
  ) {
    return plainToInstance(StudyDto, this.studiesService.getAllByOwner(user))
  }

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles({ roles: [UserRoles.RESEARCHER] })
  async create(
    @ParsedUser()
    user: User,
    @Body()
    dto: StudyCreateDto,
  ) {
    return plainToInstance(StudyDto, this.studiesService.create(dto, user))
  }
}
