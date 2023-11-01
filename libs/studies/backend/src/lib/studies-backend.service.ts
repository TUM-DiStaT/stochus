import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { validate } from 'class-validator'
import { Document, Model } from 'mongoose'
import { User } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { StudyCreateDto, StudyUpdateDto } from '@stochus/studies/shared'
import { AssignmentsCoreBackendService } from '@stochus/assignments/core/backend'
import { KeycloakAdminService } from '@stochus/auth/backend'
import { StudyParticipation } from './participation/study-participation.schema'
import { Study, StudyTask } from './study.schema'

@Injectable()
export class StudiesBackendService {
  private readonly logger = new Logger(StudiesBackendService.name)

  constructor(
    @InjectModel(Study.name)
    private readonly studyModel: Model<Study>,
    private readonly keycloakAdminService: KeycloakAdminService,
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

  async getAllByOwner(owner: User): Promise<Study[]> {
    return this.studyModel.find({
      ownerId: owner.id,
    })
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
    const study = await this.studyModel.findById(studyId).exec()
    if (study === null) {
      throw new NotFoundException()
    }
    if (study.ownerId !== user.id) {
      throw new ForbiddenException()
    }
    await this.studyModel.findByIdAndDelete(studyId).exec()
  }

  async getAllForCurrentStudent(user: User) {
    const userGroups = await this.keycloakAdminService.getGroupsForUser(user)
    return this.studyModel.aggregate([
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
            {
              $lookup: {
                from: 'assignmentcompletions',
                localField: 'assignmentCompletionIds',
                foreignField: '_id',
                as: 'assignmentCompletions',
              },
            },
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
    ])
  }
}
