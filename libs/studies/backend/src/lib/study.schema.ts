import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class StudyTask {
  @Prop({ required: true })
  assignmentId!: string

  @Prop({ required: true })
  assignmentVersion!: number

  @Prop({ required: true, type: Object })
  config!: unknown[]
}

@Schema()
export class Study {
  @Prop({ required: true, index: true })
  ownerId!: string

  @Prop({ required: true })
  name!: string

  @Prop({ required: true })
  description!: string

  @Prop({ required: true })
  messageAfterFeedback!: string

  @Prop({ required: true, type: Date })
  startDate!: string

  @Prop({ required: true, type: Date })
  endDate!: string

  @Prop({ required: true, default: (v?: boolean) => v ?? false })
  randomizeTaskOrder!: boolean

  @Prop({ required: true })
  participantsGroupId!: string

  @Prop({ required: true })
  tasks!: StudyTask[]
}

export const StudyCollectionName = Study.name

export const StudySchema = SchemaFactory.createForClass(Study)
