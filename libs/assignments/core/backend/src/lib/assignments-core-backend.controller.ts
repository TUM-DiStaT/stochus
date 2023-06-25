import { Controller, Logger } from '@nestjs/common'
import { AssignmentsCoreBackendService } from './assignments-core-backend.service'

@Controller('assignments-core-backend')
export class AssignmentsCoreBackendController {
  private logger = new Logger(AssignmentsCoreBackendController.name)

  constructor(
    private assignmentsCoreBackendService: AssignmentsCoreBackendService,
  ) {
    this.logger.log(this.assignmentsCoreBackendService)
  }
}
