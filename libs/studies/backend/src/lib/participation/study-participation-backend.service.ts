import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { shuffle } from 'lodash'
import { Connection, Document, Model, Types } from 'mongoose'
import { User } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { StudyDto } from '@stochus/studies/shared'
import { CompletionsService } from '@stochus/assignments/core/backend'
import { KeycloakAdminService } from '@stochus/auth/backend'
import { StudiesBackendService } from '../studies-backend.service'
import { Study } from '../study.schema'
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

  async getActiveParticipation(user: User, studyId: string) {
    const participations = await this.studyParticipationModel.aggregate<
      StudyParticipation & { studyArr: Study[] }
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
      {
        $lookup: {
          from: 'assignmentcompletions',
          localField: 'assignmentCompletionIds',
          foreignField: '_id',
          as: 'assignmentCompletions',
        },
      },
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

    return participation
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

    return { ...participation, assignmentCompletions }
  }

  async assertUserMayParticipateInStudy(user: User, studyDto: StudyDto) {
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
}
