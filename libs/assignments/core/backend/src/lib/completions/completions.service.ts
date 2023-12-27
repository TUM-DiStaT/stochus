import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/mongoose'
import { validate } from 'class-validator'
import { Model, Types } from 'mongoose'
import { BaseCompletionData } from '@stochus/assignments/model/shared'
import { User } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import {
  AssignmentCompletedEventPayload,
  assignmentCompletedEventToken,
} from '@stochus/core/backend'
import { AssignmentsCoreBackendService } from '../assignments-core-backend.service'
import { AssignmentCompletion } from './completion.schema'

@Injectable()
export class CompletionsService {
  private readonly logger = new Logger(CompletionsService.name)

  constructor(
    @InjectModel(AssignmentCompletion.name)
    private readonly assignmentCompletionModel: Model<AssignmentCompletion>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getById(id: string) {
    return this.assignmentCompletionModel.findById(id)
  }

  async getForAssignment(
    assignmentId: string,
    user: User,
  ): Promise<AssignmentCompletion[]> {
    AssignmentsCoreBackendService.getByIdOrError(assignmentId)

    return await this.assignmentCompletionModel
      .find({
        userId: user.id,
        assignmentId,
        isForStudy: false,
        'completionData.progress': {
          $lt: 1,
        },
      })
      .exec()
  }

  async getMostRecentForAssignment(
    assignmentId: string,
    user: User,
  ): Promise<AssignmentCompletion | undefined> {
    return (await this.getForAssignment(assignmentId, user)).sort(
      ({ lastUpdated: a }, { lastUpdated: b }) => b.valueOf() - a.valueOf(),
    )[0]
  }

  async create(assignmentId: string, user: User, config?: unknown) {
    const assignment = AssignmentsCoreBackendService.getById(assignmentId)

    if (!assignment) {
      throw new NotFoundException()
    }

    if (await this.getMostRecentForAssignment(assignmentId, user)) {
      throw new BadRequestException(
        'This user already has an active completion',
      )
    }

    const progress = assignment.getInitialCompletionData()

    return await this.assignmentCompletionModel.create({
      assignmentId: assignmentId,
      createdAt: new Date(),
      lastUpdated: new Date(),
      userId: user.id,
      config: config ?? assignment.getRandomConfig(),
      completionData: progress,
      isForStudy: false,
    } satisfies AssignmentCompletion)
  }

  async createForStudyParticipation(
    assignmentId: string,
    user: User,
    config: unknown,
  ) {
    const assignment = AssignmentsCoreBackendService.getById(assignmentId)

    if (!assignment) {
      throw new NotFoundException()
    }

    const progress = assignment.getInitialCompletionData()

    return await this.assignmentCompletionModel.create({
      assignmentId: assignmentId,
      createdAt: new Date(),
      lastUpdated: new Date(),
      userId: user.id,
      config: config ?? assignment.getRandomConfig(),
      completionData: progress,
      isForStudy: true,
    } satisfies AssignmentCompletion)
  }

  async getAllActive(user: User): Promise<Array<AssignmentCompletion>> {
    return await this.assignmentCompletionModel
      .find({
        userId: user.id,
        'completionData.progress': {
          $lt: 1,
        },
      })
      .exec()
  }

  async updateCompletionData(
    completionId: string,
    user: User,
    update: Partial<BaseCompletionData>,
  ) {
    const old = await this.assignmentCompletionModel
      .findById(completionId)
      .exec()

    if (old === null) {
      throw new NotFoundException()
    }

    if (old.userId !== user.id) {
      throw new UnauthorizedException()
    }

    const assignment = AssignmentsCoreBackendService.getByIdOrError(
      old.assignmentId,
    )

    const updateInstance = plainToInstance(assignment.completionDataClass, {
      ...old.completionData,
      ...update,
    })
    this.logger.debug(old.completionData, update, updateInstance)
    const validationErrors = await validate(updateInstance)
    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors)
    }

    const now = new Date()

    if ((updateInstance as BaseCompletionData).progress === 1) {
      this.eventEmitter.emit(assignmentCompletedEventToken, {
        userId: user.id,
        assignmentCompletionId: new Types.ObjectId(completionId),
        time: now,
      } satisfies AssignmentCompletedEventPayload)
    }

    return this.assignmentCompletionModel.findByIdAndUpdate(
      completionId,
      {
        lastUpdated: now,
        completionData: updateInstance,
      } satisfies Partial<AssignmentCompletion>,
      {
        new: true,
      },
    )
  }

  async deleteMany(ids: Types.ObjectId[]) {
    await this.assignmentCompletionModel.deleteMany({
      _id: {
        $in: ids,
      },
    })
  }
}
