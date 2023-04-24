import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InteractionLog } from './interaction-logs.schema'
import { InjectModel } from '@nestjs/mongoose'
import { InteractionLogCreateDto } from '@stochus/interaction-logs/dtos'

@Injectable()
export class InteractionLogsService {
  constructor(
    @InjectModel(InteractionLog.name)
    private readonly interactionLogsModel: Model<InteractionLog>,
  ) {}

  async createNewLogEntry(
    log: InteractionLogCreateDto,
  ): Promise<InteractionLog> {
    const entity = await this.interactionLogsModel.create({
      datetime: new Date(),
      userId: 'Michael der kek',
      payload: log.payload,
    })

    return entity
  }
}
