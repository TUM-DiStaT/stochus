import { Types } from 'mongoose'

export const assignmentCompletedEventToken = Symbol(
  'assignment-completed-created',
)

export type AssignmentCompletedEventPayload = {
  time: Date
  userId: string
  assignmentCompletionId: Types.ObjectId
}
