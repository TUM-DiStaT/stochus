import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema()
export class InteractionLog {
  @Prop({ required: true })
  userId!: string

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'assignmentcompletions',
  })
  assignmentCompletionId!: string

  @Prop({ type: Date, required: true })
  datetime!: Date

  @Prop({ type: Object })
  payload: unknown
}

export const InteractionLogSchema = SchemaFactory.createForClass(InteractionLog)
