import { Controller, Logger } from '@nestjs/common'
import { StudiesBackendService } from './studies-backend.service'

@Controller('studies')
export class StudiesBackendController {
  private readonly logger = new Logger(StudiesBackendController.name)

  constructor(private readonly studiesService: StudiesBackendService) {
    this.logger.debug('Created instance', this.studiesService)
  }
}
