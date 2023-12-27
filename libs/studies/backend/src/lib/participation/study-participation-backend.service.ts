import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { shuffle } from 'lodash'
import { Connection, Document, Model, Types } from 'mongoose'
import { User } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { StudyDto } from '@stochus/studies/shared'
import {
  AssignmentCompletion,
  CompletionsService,
} from '@stochus/assignments/core/backend'
import { KeycloakAdminService } from '@stochus/auth/backend'
import {
  StudyParticipationCreatedEventPayload,
  studyParticipationCreatedEventToken,
} from '@stochus/core/backend'
import { StudiesBackendService } from '../studies-backend.service'
import { Study } from '../study.schema'
import {
  StudyParticipationWithAssignmentCompletions,
  joinStudyParticipationOnAssignmentCompletions,
  sortParticipationAssignmentCompletions,
} from './study-participation-query-utils'
import { StudyParticipation } from './study-participation.schema'

@Injectable()
export class StudyParticipationBackendService {
  private readonly logger = new Logger(StudyParticipationBackendService.name)

  constructor(
    @InjectModel(StudyParticipation.name)
    private readonly studyParticipationModel: Model<StudyParticipation>,
    private readonly eventEmitter: EventEmitter2,
    @InjectConnection() private readonly mongooseConnection: Connection,
    private readonly studiesService: StudiesBackendService,
    private readonly keycloakAdminService: KeycloakAdminService,
    private readonly completionsService: CompletionsService,
  ) {
    this.logger.debug('Instance created successfully')
  }

  async getActiveParticipation(user: User, studyId: string) {
    const participations = await this.studyParticipationModel.aggregate<
      StudyParticipationWithAssignmentCompletions & { studyArr: Study[] }
    >([
      {
        $match: {
          studyId: new Types.ObjectId(studyId),
          userId: user.id,
        },
      },
      {
        $lookup: {
          from: 'studies',
          localField: 'studyId',
          foreignField: '_id',
          as: 'studyArr',
        },
      },
      joinStudyParticipationOnAssignmentCompletions,
    ])

    if (participations.length !== 1) {
      throw new NotFoundException()
    }

    const { studyArr, ...participation } = participations[0]

    if (studyArr.length !== 1) {
      this.logger.error('Participation with non-one study found', {
        studyId,
        userId: user.id,
        participation,
        studyArr,
      })
      throw new InternalServerErrorException()
    }

    const study = plainToInstance(StudyDto, studyArr[0])

    await this.assertUserMayParticipateInStudy(user, study)

    return sortParticipationAssignmentCompletions(participation)
  }

  async createParticipation(user: User, studyId: string) {
    const transactionSession = await this.mongooseConnection.startSession()
    transactionSession.startTransaction()

    const study = plainToInstance(
      StudyDto,
      await this.studiesService.getById(studyId),
    )

    await this.assertUserMayParticipateInStudy(user, study)

    const tasksRandomized = study.randomizeTaskOrder
      ? shuffle(study.tasks)
      : study.tasks

    const assignmentCompletions: Document[] = []

    for (const { assignmentId, config } of tasksRandomized) {
      const completion =
        await this.completionsService.createForStudyParticipation(
          assignmentId,
          user,
          config,
        )
      assignmentCompletions.push(completion)
    }

    const participation = await this.studyParticipationModel.create({
      userId: user.id,
      studyId: new Types.ObjectId(studyId),
      assignmentCompletionIds: assignmentCompletions.map((c) => c._id),
    })

    await transactionSession.commitTransaction()
    await transactionSession.endSession()

    this.eventEmitter.emit(studyParticipationCreatedEventToken, {
      time: new Date(),
      studyParticipationId: participation._id,
      userId: user.id,
    } satisfies StudyParticipationCreatedEventPayload)

    const result = participation as typeof participation & {
      assignmentCompletions: typeof assignmentCompletions
    }
    result.assignmentCompletions = assignmentCompletions
    return result
  }

  async assertUserMayParticipateInStudy(
    user: User,
    studyIdOrDto: StudyDto | string,
  ) {
    const studyDto =
      typeof studyIdOrDto === 'string'
        ? plainToInstance(
            StudyDto,
            await this.studiesService.getById(studyIdOrDto),
          )
        : studyIdOrDto

    const userGroups = await this.keycloakAdminService.getGroupsForUser(user)
    const now = new Date().valueOf()

    if (now < studyDto.startDate.valueOf()) {
      this.logger.verbose("Denying study, hasn't started yet", {
        now: new Date(),
        startDate: studyDto.startDate,
      })
      throw new ForbiddenException()
    }

    if (studyDto.endDate.valueOf() < now) {
      this.logger.verbose('Denying study, already ended', {
        now: new Date(),
        endDate: studyDto.endDate,
      })
      throw new ForbiddenException()
    }

    if (
      !userGroups.some((group) => group.id === studyDto.participantsGroupId)
    ) {
      this.logger.verbose('Denying study, user not in target group', {
        usersGroups: userGroups.map((g) => g.id),
        studyGroup: studyDto.participantsGroupId,
      })
      throw new ForbiddenException()
    }
  }

  async assertCompletionIsPartOfActiveStudy(
    user: User,
    assignmentCompletionId: string,
  ) {
    const participation = await this.studyParticipationModel
      .findOne({
        assignmentCompletionIds: assignmentCompletionId,
      })
      .populate('studyId')
      .populate('assignmentCompletionIds')
      .exec()

    if (!participation) {
      throw new NotFoundException()
    }

    const completions =
      participation.assignmentCompletionIds as unknown as Array<
        Document<Types.ObjectId, unknown, AssignmentCompletion>
      >

    const study = plainToInstance(StudyDto, participation.studyId)
    const completion = completions.find((completion) =>
      completion._id?.equals(assignmentCompletionId),
    )

    if (!completion) {
      this.logger.error(
        "Couldn't find an assignment with the correct ID despite it being the mongo find query!",
        {
          queryCompletionId: assignmentCompletionId,
          actualCompletions: participation.assignmentCompletionIds,
        },
      )
      throw new InternalServerErrorException()
    }

    const now = new Date().valueOf()
    const completionUserId = completion.get('userId')

    if (
      now < study.startDate.valueOf() ||
      study.endDate.valueOf() < now ||
      completionUserId !== user.id
    ) {
      this.logger.verbose(
        now < study.startDate.valueOf(),
        study.endDate.valueOf() < now,
        completionUserId !== user.id,
        completionUserId,
        user.id,
        participation.assignmentCompletionIds,
      )
      throw new ForbiddenException()
    }
  }

  async getStudyByParticipation(studyParticipationId: string) {
    const study = await this.studyParticipationModel
      .findById(studyParticipationId)
      .populate('studyId')
      .exec()
    return plainToInstance(StudyDto, study?.studyId)
  }
}
