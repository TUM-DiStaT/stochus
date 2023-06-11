import { Controller } from '@nestjs/common'
import { AssignmentsCoreBackendService } from './assignments-core-backend.service'

@Controller('assignments-core-backend')
export class AssignmentsCoreBackendController {
  constructor(
    private assignmentsCoreBackendService: AssignmentsCoreBackendService,
  ) {}
}
