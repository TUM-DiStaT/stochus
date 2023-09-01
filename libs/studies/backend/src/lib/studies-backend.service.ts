import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { validate } from 'class-validator'
import { Model } from 'mongoose'
import { User } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { StudyCreateDto } from '@stochus/studies/shared'
import { AssignmentsCoreBackendService } from '@stochus/assignments/core/backend'
import { Study } from './study.schema'

@Injectable()
export class StudiesBackendService {
  private readonly logger = new Logger(StudiesBackendService.name)

  constructor(
    @InjectModel(Study.name)
    private readonly studyModel: Model<Study>,
  ) {
    this.logger.debug('Instance created successfully')
  }

  async create(dto: StudyCreateDto, owner: User) {
    for (const task of dto.tasks) {
      const assignment = AssignmentsCoreBackendService.getById(
        task.assignmentId,
      )
      if (!assignment) {
        throw new BadRequestException(
          `No assignment with ID ${task.assignmentId} exists.`,
        )
      }
      const validationErrors = await validate(
        plainToInstance(assignment.configurationClass, task.config),
      )
      if (validationErrors.length > 0) {
        throw new BadRequestException(JSON.stringify(validationErrors))
      }
    }

    return this.studyModel.create({
      ...dto,
      ownerId: owner.id,
    })
  }

  async getAllByOwner(owner: User): Promise<Study[]> {
    return this.studyModel.find({
      ownerId: owner.id,
    })
  }
}
