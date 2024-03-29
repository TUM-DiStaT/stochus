import { studentUser } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { AssignmentCompletionDto } from './assignment-completion.dto'

export const guessRandomNumberJustStartedCompletionDto = plainToInstance(
  AssignmentCompletionDto,
  {
    _id: '64abf10802cc7e877a4238f7',
    userId: studentUser.id,
    assignmentId: 'GuessRandomNumberAssignment',
    createdAt: new Date('2023-07-10T11:52:40.575Z'),
    lastUpdated: new Date('2023-07-10T11:52:40.575Z'),
    config: {
      result: 33,
    },
    completionData: {
      progress: 0,
      guesses: [],
    },
    isForStudy: false,
  },
)
