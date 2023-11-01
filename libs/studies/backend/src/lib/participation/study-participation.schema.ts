import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { Study } from '../study.schema'

@Schema()
export class StudyParticipation {
  @Prop({ required: true, index: true, type: Types.ObjectId, ref: Study.name })
  studyId!: string

  @Prop({ required: true, index: true })
  userId!: string

  @Prop({ required: true, index: true, type: [Types.ObjectId] })
  assignmentCompletionIds!: string[]
}

export const StudyParticipationSchema =
  SchemaFactory.createForClass(StudyParticipation)
