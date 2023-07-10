import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthGuard, RoleGuard, Roles } from 'nest-keycloak-connect'
import { User, UserRoles } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { ParsedUser } from '@stochus/auth/backend'
import {
  InteractionLogCreateDto,
  InteractionLogDto,
} from '@stochus/interaction-logs/dtos'
import { InteractionLogsService } from './interaction-logs.service'

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
