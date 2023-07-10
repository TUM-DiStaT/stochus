import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AssignmentsCoreBackendController } from './assignments-core-backend.controller'
import { AssignmentsCoreBackendService } from './assignments-core-backend.service'
import {
  AssignmentCompletion,
  AssignmentCompletionSchema,
} from './completions/completion.schema'
import { CompletionsController } from './completions/completions.controller'
import { CompletionsService } from './completions/completions.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AssignmentCompletion.name,
        schema: AssignmentCompletionSchema,
      },
    ]),
  ],
  controllers: [AssignmentsCoreBackendController, CompletionsController],
  providers: [AssignmentsCoreBackendService, CompletionsService],
  exports: [AssignmentsCoreBackendService],
})
export class AssignmentsCoreBackendModule {}
