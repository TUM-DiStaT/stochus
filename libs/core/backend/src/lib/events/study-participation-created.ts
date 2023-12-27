import { Types } from 'mongoose'

export const studyParticipationCreatedToken = Symbol(
  'study-participation-created',
)

export type StudyParticipationCreatedPayload = {
  time: Date
  userId: string
  studyParticipationId: Types.ObjectId
}
