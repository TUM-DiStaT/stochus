import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class StudyParticipation {
  @Prop({ required: true, index: true })
  studyId!: string

  @Prop({ required: true, index: true })
  userId!: string

  @Prop({ required: true, index: true })
  assignmentCompletionIds!: string[]
}

export const StudyParticipationSchema =
  SchemaFactory.createForClass(StudyParticipation)
