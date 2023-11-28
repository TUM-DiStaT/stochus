import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { AssignmentCompletion } from '@stochus/assignments/core/backend'

@Schema()
export class InteractionLog {
  @Prop({ required: true })
  userId!: string

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: AssignmentCompletion.name,
  })
  assignmentCompletionId!: string

  @Prop({ type: Date, required: true })
  datetime!: Date

  @Prop({ type: Object })
  payload: unknown
}

export const InteractionLogSchema = SchemaFactory.createForClass(InteractionLog)
