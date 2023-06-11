import { Module } from '@nestjs/common'
import { AssignmentsCoreBackendController } from './assignments-core-backend.controller'
import { AssignmentsCoreBackendService } from './assignments-core-backend.service'

@Module({
  controllers: [AssignmentsCoreBackendController],
  providers: [AssignmentsCoreBackendService],
  exports: [AssignmentsCoreBackendService],
})
export class AssignmentsCoreBackendModule {}
