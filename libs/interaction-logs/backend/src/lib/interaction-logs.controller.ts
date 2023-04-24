import { Body, Controller, Post } from '@nestjs/common'
import { InteractionLogsService } from './interaction-logs.service'
import { Public } from 'nest-keycloak-connect'
import { plainToInstance } from 'class-transformer'
import {
  InteractionLogCreateDto,
  InteractionLogDto,
} from '@stochus/interaction-logs/dtos'

@Controller('interaction-logs')
export class InteractionLogsController {
  constructor(private interactionLogsBackendService: InteractionLogsService) {}

  @Post()
  @Public()
  async createLog(@Body() dto: InteractionLogCreateDto) {
    const entry = await this.interactionLogsBackendService.createNewLogEntry(
      dto,
    )

    return plainToInstance(InteractionLogDto, entry, {
      excludeExtraneousValues: true,
    })
  }
}
