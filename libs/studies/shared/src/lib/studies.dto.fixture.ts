import {
  GuessRandomNumberAssignment,
  GuessRandomNumberAssignmentConfiguration,
} from '@stochus/assignments/demos/guess-random-number/shared'
import { researcherUser } from '@stochus/auth/shared'
import { StudyDto } from './study.dto'

export const validStudyDto: StudyDto = {
  id: '64f1e1cdf024ff6951623324',
  name: 'Valid study for testing',
  description: 'A study only defined for unit tests',
  ownerId: researcherUser.id,
  startDate: new Date(2022, 8, 1),
  endDate: new Date(2022, 8, 29),
  tasks: [
    {
      assignmentId: GuessRandomNumberAssignment.id,
      assignmentVersion: GuessRandomNumberAssignment.version,
      config: {
        result: 42,
      } satisfies GuessRandomNumberAssignmentConfiguration,
    },
  ],
}
