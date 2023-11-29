import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { StudiesBackendModule } from '@stochus/studies/backend'
import { InteractionLogsController } from './interaction-logs.controller'
import { InteractionLog, InteractionLogSchema } from './interaction-logs.schema'
import { InteractionLogsService } from './interaction-logs.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: InteractionLog.name,
        schema: InteractionLogSchema,
      },
    ]),
    StudiesBackendModule,
  ],
  controllers: [InteractionLogsController],
  providers: [InteractionLogsService],
  exports: [InteractionLogsService],
})
export class InteractionLogsModule {}
