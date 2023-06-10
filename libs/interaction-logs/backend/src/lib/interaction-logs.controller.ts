import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { InteractionLogsService } from './interaction-logs.service'
import { plainToInstance } from 'class-transformer'
import {
  InteractionLogCreateDto,
  InteractionLogDto,
} from '@stochus/interaction-logs/dtos'
import { ParsedUser } from '@stochus/auth/backend'
import { User, UserRoles } from '@stochus/auth/shared'
import { AuthGuard, RoleGuard, Roles } from 'nest-keycloak-connect'

@Controller('interaction-logs')
export class InteractionLogsController {
  constructor(private interactionLogsBackendService: InteractionLogsService) {}

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles({ roles: [UserRoles.STUDENT] })
  async createLog(
    @Body() dto: InteractionLogCreateDto,
    @ParsedUser() user: User,
  ) {
    const entry = await this.interactionLogsBackendService.createNewLogEntry(
      dto,
      user,
    )

    console.log({ dto, entry })

    return plainToInstance(InteractionLogDto, entry, {
      excludeExtraneousValues: true,
    })
  }
}
