import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
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
    ]),
  ],
  controllers: [StudiesBackendController],
  providers: [StudiesBackendService],
  exports: [StudiesBackendService],
})
export class StudiesBackendModule {}
