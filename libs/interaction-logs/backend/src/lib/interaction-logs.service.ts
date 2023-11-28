import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '@stochus/auth/shared'
import { StudyParticipationBackendService } from '@stochus/studies/backend'
import { InteractionLogCreateDto } from '@stochus/interaction-logs/dtos'
import { InteractionLog } from './interaction-logs.schema'

@Injectable()
export class InteractionLogsService {
  constructor(
    @InjectModel(InteractionLog.name)
    private readonly interactionLogsModel: Model<InteractionLog>,
    private readonly completionsService: StudyParticipationBackendService,
  ) {}

  async createNewLogEntry(
    log: InteractionLogCreateDto,
    user: User,
    assignmentCompletionId: string,
  ): Promise<InteractionLog> {
    await this.completionsService.assertCompletionIsPartOfActiveStudy(
      user,
      assignmentCompletionId,
    )

    return await this.interactionLogsModel.create({
      datetime: new Date(),
      userId: user.id,
      payload: log.payload,
      assignmentCompletionId,
    })
  }

  async getAll(): Promise<Array<InteractionLog>> {
    return await this.interactionLogsModel.find().exec()
  }
}
