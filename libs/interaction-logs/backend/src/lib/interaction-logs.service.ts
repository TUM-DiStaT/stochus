import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '@stochus/auth/shared'
import { InteractionLogCreateDto } from '@stochus/interaction-logs/dtos'
import { InteractionLog } from './interaction-logs.schema'

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

  async getAll(): Promise<Array<InteractionLog>> {
    return await this.interactionLogsModel.find().exec()
  }
}
