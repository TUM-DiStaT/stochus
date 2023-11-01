import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AssignmentsCoreBackendModule } from '@stochus/assignments/core/backend'
import { BackendAuthModule } from '@stochus/auth/backend'
import { StudyParticipationBackendService } from './participation/study-participation-backend.service'
import { StudyParticipationController } from './participation/study-participation.controller'
import {
  StudyParticipation,
  StudyParticipationSchema,
} from './participation/study-participation.schema'
import { StudiesBackendController } from './studies-backend.controller'
import { StudiesBackendService } from './studies-backend.service'
import { Study, StudySchema } from './study.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Study.name,
        schema: StudySchema,
      },
      {
        name: StudyParticipation.name,
        schema: StudyParticipationSchema,
      },
    ]),
    BackendAuthModule,
    AssignmentsCoreBackendModule,
  ],
  controllers: [StudiesBackendController, StudyParticipationController],
  providers: [StudiesBackendService, StudyParticipationBackendService],
  exports: [StudiesBackendService],
})
export class StudiesBackendModule {}
