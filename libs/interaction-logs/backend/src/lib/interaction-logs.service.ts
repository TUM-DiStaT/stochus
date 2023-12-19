import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { User } from '@stochus/auth/shared'
import { StudyParticipationBackendService } from '@stochus/studies/backend'
import { InteractionLogCreateDto } from '@stochus/interaction-logs/dtos'
import { InteractionLog } from './interaction-logs.schema'

@Injectable()
export class InteractionLogsService {
  constructor(
    @InjectModel(InteractionLog.name)
    private readonly interactionLogsModel: Model<InteractionLog>,
    private readonly studyParticipationBackendService: StudyParticipationBackendService,
  ) {}

  async createNewAssignmentCompletionLogEntry(
    log: InteractionLogCreateDto,
    user: User,
    assignmentCompletionId: string,
  ): Promise<InteractionLog> {
    await this.studyParticipationBackendService.assertCompletionIsPartOfActiveStudy(
      user,
      assignmentCompletionId,
    )

    return await this.interactionLogsModel.create({
      datetime: new Date(),
      userId: user.id,
      payload: log.payload,
      assignmentCompletionId: new Types.ObjectId(assignmentCompletionId),
    })
  }

  async createNewStudyParticipationLogEntry(
    log: InteractionLogCreateDto,
    user: User,
    studyParticipationId: string,
  ): Promise<InteractionLog> {
    const study =
      await this.studyParticipationBackendService.getStudyByParticipation(
        studyParticipationId,
      )

    await this.studyParticipationBackendService.assertUserMayParticipateInStudy(
      user,
      study,
    )

    return await this.interactionLogsModel.create({
      datetime: new Date(),
      userId: user.id,
      payload: log.payload,
      studyParticipationId: new Types.ObjectId(studyParticipationId),
    })
  }

  async getAll(): Promise<Array<InteractionLog>> {
    return await this.interactionLogsModel.find().exec()
  }
}
