import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { InteractionLogsService } from './interaction-logs.service'
import {
  InteractionLogCreateDto,
  InteractionLogDto,
} from '@stochus/interaction-logs/dtos'
import { ParsedUser } from '@stochus/auth/backend'
import { User, UserRoles } from '@stochus/auth/shared'
import { AuthGuard, RoleGuard, Roles } from 'nest-keycloak-connect'
import { plainToInstance } from '@stochus/core/shared'

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

    return plainToInstance(InteractionLogDto, entry)
  }

  @Get()
  @Roles({ roles: [UserRoles.RESEARCHER] })
  async getAllLogs() {
    const logs = await this.interactionLogsBackendService.getAll()
    return plainToInstance(InteractionLogDto, logs)
  }
}
