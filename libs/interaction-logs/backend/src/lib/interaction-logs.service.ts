import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InteractionLog } from './interaction-logs.schema'
import { InjectModel } from '@nestjs/mongoose'
import { InteractionLogCreateDto } from '@stochus/interaction-logs/dtos'
import { User } from '@stochus/auth/shared'

@Injectable()
export class InteractionLogsService {
  constructor(
    @InjectModel(InteractionLog.name)
    private readonly interactionLogsModel: Model<InteractionLog>,
  ) {}

  async createNewLogEntry(
    log: InteractionLogCreateDto,
    user: User,
  ): Promise<InteractionLog> {
    return await this.interactionLogsModel.create({
      datetime: new Date(),
      userId: user.id,
      payload: log.payload,
    })
  }
}
