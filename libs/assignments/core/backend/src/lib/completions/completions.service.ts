import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '@stochus/auth/shared'
import { AssignmentsCoreBackendService } from '../assignments-core-backend.service'
import { AssignmentCompletion } from './completion.schema'

@Injectable()
export class CompletionsService {
  constructor(
    @InjectModel(AssignmentCompletion.name)
    private readonly assignmentCompletionModel: Model<AssignmentCompletion>,
  ) {}

  async getById(id: string) {
    return this.assignmentCompletionModel.findById(id)
  }

  async getForAssignment(
    assignmentId: string,
    user: User,
  ): Promise<AssignmentCompletion[]> {
    const assignment = AssignmentsCoreBackendService.getById(assignmentId)

    if (!assignment) {
      throw new NotFoundException()
    }

    return await this.assignmentCompletionModel
      .find({
        userId: user.id,
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

  async createForAssignment(
    assignmentId: string,
    user: User,
    config?: unknown,
  ) {
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
    } satisfies AssignmentCompletion)
  }
}
