import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseCompletionData } from '@stochus/assignments/model/shared'

@Schema()
export class AssignmentCompletion {
  @Prop({ required: true })
  userId!: string

  @Prop({ required: true })
  assignmentId!: string

  @Prop({ type: Date, required: true })
  created!: Date

  @Prop({ type: Date, required: true })
  lastUpdated!: Date

  @Prop({ type: Object })
  config!: unknown

  @Prop({ type: Object })
  completionData!: BaseCompletionData
}

export const AssignmentCompletionSchema =
  SchemaFactory.createForClass(AssignmentCompletion)
