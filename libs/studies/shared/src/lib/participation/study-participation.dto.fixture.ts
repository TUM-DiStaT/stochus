import { guessRandomNumberJustStartedCompletionDto } from '@stochus/assignment/core/shared'
import { mathmagicianStudentUser } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { validStudyDto } from '../studies.dto.fixture'
import {
  StudyParticipationCreateDto,
  StudyParticipationDto,
} from './study-participation.dto'

export const plainValidStudyParticipationCreateDto: StudyParticipationCreateDto =
  {
    userId: mathmagicianStudentUser.id,
    studyId: validStudyDto.id,
    assignmentCompletionIds: [guessRandomNumberJustStartedCompletionDto.id],
  }

export const validStudyParticipationCreateDto = plainToInstance(
  StudyParticipationCreateDto,
  plainValidStudyParticipationCreateDto,
)

export const plainValidStudyParticipationDto = {
  ...plainValidStudyParticipationCreateDto,
  _id: '65425996737f65f1ea0647ee',
}

export const validStudyParticipationDto = plainToInstance(
  StudyParticipationDto,
  plainValidStudyParticipationDto,
)
