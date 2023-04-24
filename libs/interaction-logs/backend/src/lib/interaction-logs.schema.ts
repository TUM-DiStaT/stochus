import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class InteractionLog {
  // TODO: validate correct user ID
  @Prop({ required: true })
  userId!: string

  @Prop({ type: Date, required: true })
  datetime!: Date

  @Prop({ type: Object })
  payload: unknown
}

export const InteractionLogSchema = SchemaFactory.createForClass(InteractionLog)
