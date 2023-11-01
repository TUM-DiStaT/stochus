import { ForbiddenException, Injectable, Logger } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { shuffle } from 'lodash'
import { Connection, Model, Types } from 'mongoose'
import { User } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { StudyDto } from '@stochus/studies/shared'
import { CompletionsService } from '@stochus/assignments/core/backend'
import { KeycloakAdminService } from '@stochus/auth/backend'
import { StudiesBackendService } from '../studies-backend.service'
import { StudyParticipation } from './study-participation.schema'

@Injectable()
export class StudyParticipationBackendService {
  private readonly logger = new Logger(StudyParticipationBackendService.name)

  constructor(
    @InjectModel(StudyParticipation.name)
    private readonly studyParticipationModel: Model<StudyParticipation>,
    @InjectConnection() private readonly mongooseConnection: Connection,
    private readonly studiesService: StudiesBackendService,
    private readonly keycloakAdminService: KeycloakAdminService,
    private readonly completionsService: CompletionsService,
  ) {
    this.logger.debug('Instance created successfully')
  }

  async createParticipation(user: User, studyId: string) {
    const transactionSession = await this.mongooseConnection.startSession()
    transactionSession.startTransaction()

    const study = plainToInstance(
      StudyDto,
      await this.studiesService.getById(studyId),
    )
    const userGroups = await this.keycloakAdminService.getGroupsForUser(user)
    const now = new Date().valueOf()

    if (now < study.startDate.valueOf()) {
      this.logger.verbose("Denying study, hasn't started yet", {
        now: new Date(),
        startDate: study.startDate,
      })
      throw new ForbiddenException()
    }

    if (study.endDate.valueOf() < now) {
      this.logger.verbose('Denying study, already ended', {
        now: new Date(),
        endDate: study.endDate,
      })
      throw new ForbiddenException()
    }

    if (!userGroups.some((group) => group.id === study.participantsGroupId)) {
      this.logger.verbose('Denying study, user not in target group', {
        usersGroups: userGroups.map((g) => g.id),
        studyGroup: study.participantsGroupId,
      })
      throw new ForbiddenException()
    }

    const tasksRandomized = study.randomizeTaskOrder
      ? shuffle(study.tasks)
      : study.tasks

    const assignmentCompletionIds: string[] = []

    for (const { assignmentId, config } of tasksRandomized) {
      const completion =
        await this.completionsService.createForStudyParticipation(
          assignmentId,
          user,
          config,
        )
      assignmentCompletionIds.push(completion.id)
    }

    const participation = await this.studyParticipationModel.create({
      userId: user.id,
      studyId: new Types.ObjectId(studyId),
      assignmentCompletionIds,
    })

    await transactionSession.commitTransaction()
    await transactionSession.endSession()

    return participation
  }
}
