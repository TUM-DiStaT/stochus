import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { AssignmentCompletionCollectionName } from '@stochus/assignments/core/backend'
import { StudyCollectionName } from '@stochus/studies/backend'

@Schema()
export class InteractionLog {
  @Prop({ required: true })
  userId!: string

  @Prop({
    type: Types.ObjectId,
    ref: StudyCollectionName,
  })
  studyParticipationId?: string

  @Prop({
    type: Types.ObjectId,
    ref: AssignmentCompletionCollectionName,
  })
  assignmentCompletionId?: string

  @Prop({ type: Date, required: true })
  datetime!: Date

  @Prop({ type: Object })
  payload: unknown
}

export const InteractionLogSchema = SchemaFactory.createForClass(InteractionLog)
