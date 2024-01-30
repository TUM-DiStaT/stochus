import { Controller, Logger } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AssignmentsCoreBackendService } from './assignments-core-backend.service'

@Controller('assignments-core-backend')
@ApiTags('assignments')
export class AssignmentsCoreBackendController {
  private logger = new Logger(AssignmentsCoreBackendController.name)

  constructor(
    private assignmentsCoreBackendService: AssignmentsCoreBackendService,
  ) {
    this.logger.log(this.assignmentsCoreBackendService)
  }
}
