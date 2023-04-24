import { Module } from '@nestjs/common'
import { InteractionLogsController } from './interaction-logs.controller'
import { InteractionLogsService } from './interaction-logs.service'
import { MongooseModule } from '@nestjs/mongoose'
import { InteractionLog, InteractionLogSchema } from './interaction-logs.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: InteractionLog.name,
        schema: InteractionLogSchema,
      },
    ]),
  ],
  controllers: [InteractionLogsController],
  providers: [InteractionLogsService],
  exports: [InteractionLogsService],
})
export class InteractionLogsModule {}
