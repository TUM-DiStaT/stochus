import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { User } from '@stochus/auth/shared'
import { AssignmentCompletion } from '@stochus/assignments/core/backend'
import {
  AssignmentCompletedEventPayload,
  StudyParticipationCreatedEventPayload,
  assignmentCompletedEventToken,
  studyParticipationCreatedEventToken,
} from '@stochus/core/backend'
import { StudyParticipationBackendService } from '@stochus/studies/backend'
import { InteractionLogCreateDto } from '@stochus/interaction-logs/dtos'
import { InteractionLog } from './interaction-logs.schema'

@Injectable()
export class InteractionLogsService {
  private readonly logger = new Logger(InteractionLogsService.name)

  constructor(
    @InjectModel(InteractionLog.name)
    private readonly interactionLogsModel: Model<InteractionLog>,
    private readonly studyParticipationBackendService: StudyParticipationBackendService,
  ) {
    this.logger.debug('Creating instance')
  }

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

  @OnEvent(studyParticipationCreatedEventToken)
  async logStudyParticipationCreation(
    payload: StudyParticipationCreatedEventPayload,
  ) {
    await this.interactionLogsModel.create({
      datetime: payload.time,
      userId: payload.userId,
      payload: {
        action: 'participation-created',
      },
      studyParticipationId: payload.studyParticipationId,
    })
  }

  @OnEvent(assignmentCompletedEventToken)
  async logStudyAssignmentCompleted(payload: AssignmentCompletedEventPayload) {
    const participation =
      await this.studyParticipationBackendService.getParticipationForAssignmentCompletion(
        payload.assignmentCompletionId.toString(),
      )

    if (!participation) {
      return
    }

    const completions =
      participation.assignmentCompletionIds as unknown as Array<
        AssignmentCompletion & { _id: Types.ObjectId }
      >
    const hasOtherIncompleteAssignment = completions.some(
      (completion) =>
        completion._id?.toString() !==
          payload.assignmentCompletionId.toString() &&
        completion.completionData.progress < 1,
    )

    if (hasOtherIncompleteAssignment) {
      await this.interactionLogsModel.create({
        datetime: payload.time,
        userId: payload.userId,
        payload: {
          action: 'assignment-completed',
        },
        assignmentCompletionId: payload.assignmentCompletionId,
      })
    } else {
      await this.interactionLogsModel.create({
        datetime: payload.time,
        userId: payload.userId,
        payload: {
          action: 'participation-completed',
        },
        studyParticipationId: participation._id,
      })
    }
  }
}
