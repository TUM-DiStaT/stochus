import { Document, Types } from 'mongoose'
import { AssignmentCompletion } from '@stochus/assignments/core/backend'
import { StudyParticipation } from './study-participation.schema'

export type StudyParticipationWithAssignmentCompletions = StudyParticipation & {
  assignmentCompletions: Document<
    Types.ObjectId,
    unknown,
    AssignmentCompletion
  >[]
}

export const joinStudyParticipationOnAssignmentCompletions = {
  $lookup: {
    from: 'assignmentcompletions',
    localField: 'assignmentCompletionIds',
    foreignField: '_id',
    as: 'assignmentCompletions',
  },
}

export const sortParticipationAssignmentCompletions = (
  participation?: StudyParticipationWithAssignmentCompletions | null,
) => {
  // Deal with null & undefined
  if (!participation) {
    return participation
  }

  return {
    ...participation,
    assignmentCompletions: participation.assignmentCompletionIds.map(
      (id: string) =>
        participation.assignmentCompletions.find((completion) => {
          return (completion._id as Types.ObjectId).equals(id)
        }),
    ),
  }
}
