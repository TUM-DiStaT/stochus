import {
  GuessRandomNumberAssignment,
  GuessRandomNumberAssignmentConfiguration,
} from '@stochus/assignments/demos/guess-random-number/shared'
import { researcherUserReggie, userGroups } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { StudyCreateDto, StudyDto } from './study.dto'

export const plainValidStudyDto = {
  _id: '64f1e1cdf024ff6951623324',
  name: 'Valid study for testing',
  description: 'A study only defined for unit tests',
  messageAfterFeedback: `# Thanks for participating
This is **amazing** markdown`,
  ownerId: researcherUserReggie.id,
  startDate: new Date(2022, 8, 1),
  endDate: new Date(2092, 8, 29),
  participantsGroupId: userGroups.mathmagicians.id,
  randomizeTaskOrder: false,
  tasks: [
    {
      assignmentId: GuessRandomNumberAssignment.id,
      assignmentVersion: GuessRandomNumberAssignment.version,
      config: {
        result: 42,
      } satisfies GuessRandomNumberAssignmentConfiguration,
    },
  ],
  overallProgress: 0,
  numberOfParticipants: 0,
  numberOfCompletedParticipations: 0,
  numberOfStartedParticipations: 0,
  hasInteractionLogs: false,
}
export const validStudyDto: StudyDto = plainToInstance(
  StudyDto,
  plainValidStudyDto,
)

export const validStudyCreateDto = plainToInstance(
  StudyCreateDto,
  validStudyDto,
)
