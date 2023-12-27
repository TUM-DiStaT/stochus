import { Types } from 'mongoose'

export const studyParticipationCreatedEventToken = Symbol(
  'study-participation-created',
)

export type StudyParticipationCreatedEventPayload = {
  time: Date
  userId: string
  studyParticipationId: Types.ObjectId
}
