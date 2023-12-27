import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { validate } from 'class-validator'
import { Connection, Document, Model, Types } from 'mongoose'
import { User } from '@stochus/auth/shared'
import { isDefined, plainToInstance } from '@stochus/core/shared'
import {
  StudyCreateDto,
  StudyDto,
  StudyUpdateDto,
} from '@stochus/studies/shared'
import {
  AssignmentCompletion,
  AssignmentsCoreBackendService,
  CompletionsService,
} from '@stochus/assignments/core/backend'
import { KeycloakAdminService } from '@stochus/auth/backend'
import {
  joinStudyParticipationOnAssignmentCompletions,
  sortParticipationAssignmentCompletions,
} from './participation/study-participation-query-utils'
import { StudyParticipation } from './participation/study-participation.schema'
import { Study, StudyTask } from './study.schema'

@Injectable()
export class StudiesBackendService {
  private readonly logger = new Logger(StudiesBackendService.name)

  constructor(
    @InjectModel(Study.name)
    private readonly studyModel: Model<Study>,
    private readonly keycloakAdminService: KeycloakAdminService,
    @InjectConnection() private readonly mongooseConnection: Connection,
    @InjectModel(StudyParticipation.name)
    private readonly studyParticipationModel: Model<StudyParticipation>,
    private readonly completionsService: CompletionsService,
  ) {
    this.logger.debug('Instance created successfully')
  }

  async create(dto: StudyCreateDto, owner: User) {
    const tasks = await this.parseAndValidateTasks(dto)

    return this.studyModel.create({
      ...dto,
      ownerId: owner.id,
      tasks,
    })
  }

  private async parseAndValidateTasks(dto: StudyCreateDto) {
    const mappedTasks: StudyTask[] = []
    for (const task of dto.tasks) {
      const assignment = AssignmentsCoreBackendService.getById(
        task.assignmentId,
      )
      if (!assignment) {
        throw new BadRequestException(
          `No assignment with ID ${task.assignmentId} exists.`,
        )
      }
      const mappedConfig = plainToInstance(
        assignment.configurationClass,
        task.config,
      )
      const validationErrors = await validate(mappedConfig)
      if (validationErrors.length > 0) {
        throw new BadRequestException(JSON.stringify(validationErrors))
      }
      mappedTasks.push({
        ...task,
        config: mappedConfig,
      })
    }
    return mappedTasks
  }

  async getAllByOwner(owner: User) {
    const studies: (Study & {
      participations: (StudyParticipation & {
        assignmentCompletions: AssignmentCompletion[]
        // Result of the $count in the pipeline below
        interactionLogCount: [] | [{ value: number }]
      })[]
    })[] = await this.studyModel.aggregate([
      {
        $match: {
          ownerId: owner.id,
        },
      },
      {
        $lookup: {
          from: 'studyparticipations',
          localField: '_id' satisfies keyof Document,
          foreignField: 'studyId' satisfies keyof StudyParticipation,
          as: 'participations',
          pipeline: [
            joinStudyParticipationOnAssignmentCompletions,
            {
              $lookup: {
                from: 'interactionlogs',
                localField:
                  'assignmentCompletionIds' satisfies keyof StudyParticipation,
                foreignField: 'assignmentCompletionId',
                as: 'interactionLogCount',
                pipeline: [
                  {
                    $count: 'value',
                  },
                ],
              },
            },
          ],
        },
      },
    ])

    return Promise.all(
      studies.map(async (study) => {
        const {
          numberOfStartedParticipations,
          numberOfCompletedParticipations,
          overallProgressSum,
          interactionLogCount,
        } = study.participations.reduce(
          (acc, participation) => {
            const progress =
              participation.assignmentCompletions.reduce(
                (sum, { completionData: { progress } }) => sum + progress,
                0,
              ) / Math.max(1, participation.assignmentCompletions.length)
            return {
              overallProgressSum: acc.overallProgressSum + progress,
              numberOfStartedParticipations:
                acc.numberOfStartedParticipations + (progress === 0 ? 0 : 1),
              numberOfCompletedParticipations:
                acc.numberOfCompletedParticipations + (progress === 1 ? 1 : 0),
              interactionLogCount:
                acc.interactionLogCount +
                (participation.interactionLogCount[0]?.value ?? 0),
            }
          },
          {
            overallProgressSum: 0,
            numberOfStartedParticipations: 0,
            numberOfCompletedParticipations: 0,
            interactionLogCount: 0,
          },
        )

        const numberOfParticipants =
          await this.keycloakAdminService.countMembersOfGroup(
            study.participantsGroupId,
          )
        return {
          ...study,
          overallProgress:
            overallProgressSum / Math.max(1, numberOfParticipants),
          numberOfParticipants,
          numberOfStartedParticipations,
          numberOfCompletedParticipations,
          hasInteractionLogs: interactionLogCount > 0,
        }
      }),
    )
  }

  async getForDownload(id: string, user: User) {
    // Technically not correctly typed, but we don't need the extra props here
    // and plainToInstance will take care of it after returning
    const studies: (Document<Types.ObjectId> &
      Study & {
        participations: (Document<Types.ObjectId> &
          StudyParticipation & {
            assignmentCompletions: (Document<Types.ObjectId> &
              AssignmentCompletion & {
                interactionLogs: Document<Types.ObjectId>[]
              })[]
          })[]
      })[] = await this.studyModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'studyparticipations',
          localField: '_id' satisfies keyof Document,
          foreignField: 'studyId' satisfies keyof StudyParticipation,
          as: 'participations',
          pipeline: [
            {
              $lookup: {
                ...joinStudyParticipationOnAssignmentCompletions.$lookup,
                pipeline: [
                  {
                    $lookup: {
                      from: 'interactionlogs',
                      localField: '_id' satisfies keyof Document,
                      foreignField: 'assignmentCompletionId',
                      as: 'interactionLogs',
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: 'interactionlogs',
                localField: '_id',
                foreignField: 'studyParticipationId',
                as: 'generalInteractionLogs',
              },
            },
          ],
        },
      },
    ])

    if (studies.length !== 1) {
      throw new NotFoundException()
    }

    const study = studies[0]
    if (study.ownerId !== user.id) {
      throw new ForbiddenException()
    }

    return study
  }

  async getById(id: string) {
    const result = await this.studyModel.findById(id).exec()
    if (!result) {
      throw new NotFoundException()
    }
    return result
  }

  async update(id: string, update: StudyUpdateDto, user: User) {
    const oldStudy = await this.studyModel.findById(id).exec()
    if (!oldStudy) {
      throw new NotFoundException()
    }
    if (oldStudy.ownerId !== user.id) {
      throw new ForbiddenException()
    }
    const tasks = await this.parseAndValidateTasks(update)
    return await this.studyModel
      .findByIdAndUpdate(id, { ...update, tasks, ownerId: user.id })
      .exec()
  }

  async delete(studyId: string, user: User) {
    const transactionSession = await this.mongooseConnection.startSession()
    transactionSession.startTransaction()

    const study = await this.getForDownload(studyId, user)

    const completionIds = study.participations
      .flatMap((participation) => participation.assignmentCompletions)
      .map((completion) => completion._id)
      .filter(isDefined)

    const interactionLogIds = study.participations
      .flatMap((participation) => participation.assignmentCompletions)
      .flatMap((completion) => completion.interactionLogs)
      .map((log) => log._id)
      .filter(isDefined)

    // Inline reference to avoid cyclic dependency.
    // Should eventually be extracted to independent constant
    await this.mongooseConnection.collection('interactionlogs').deleteMany({
      _id: {
        $in: interactionLogIds,
      },
    })
    await this.studyParticipationModel.deleteMany({
      studyId: {
        $eq: new Types.ObjectId(studyId),
      },
    })
    await this.completionsService.deleteMany(completionIds)
    await this.studyModel.findByIdAndDelete(studyId)

    await transactionSession.commitTransaction()
    await transactionSession.endSession()
  }

  async getAllForCurrentStudent(user: User) {
    const userGroups = await this.keycloakAdminService.getGroupsForUser(user)
    const studies = await this.studyModel
      .aggregate([
        {
          $match: {
            participantsGroupId: {
              $in: userGroups.map((g) => g.id),
            },
          },
        },
        {
          $lookup: {
            from: 'studyparticipations',
            localField: '_id' satisfies keyof Document,
            foreignField: 'studyId' satisfies keyof StudyParticipation,
            as: 'participation',
            pipeline: [
              {
                $match: {
                  userId: user.id,
                },
              },
              joinStudyParticipationOnAssignmentCompletions,
            ],
          },
        },
        {
          $project: {
            name: true,
            startDate: true,
            endDate: true,
            description: true,
            participation: {
              $arrayElemAt: ['$participation', 0],
            },
          },
        },
        {
          $sort: {
            endDate: 1,
          },
        },
      ])
      .exec()
    return studies.map((study) => {
      return {
        ...study,
        participation: sortParticipationAssignmentCompletions(
          study.participation,
        ),
      }
    })
  }

  async getByIdForStudent(id: string, user: User) {
    const userGroups = await this.keycloakAdminService.getGroupsForUser(user)
    const study = await this.studyModel.findById(id)

    if (!study) {
      throw new NotFoundException()
    }

    const dto = plainToInstance(StudyDto, study)
    if (
      !userGroups
        .map((group) => group.id)
        .includes(study.participantsGroupId) ||
      !dto.isActive()
    ) {
      throw new ForbiddenException()
    }

    return study
  }
}
