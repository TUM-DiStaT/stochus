import { instanceToPlain } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import 'reflect-metadata'
import { plainToInstance } from '@stochus/core/shared'
import { StudyParticipationDto } from './study-participation.dto'
import {
  plainValidStudyParticipationDto,
  validStudyParticipationDto,
} from './study-participation.dto.fixture'

it('should correctly expose all relevant properties', () => {
  expect(
    instanceToPlain(
      plainToInstance(StudyParticipationDto, plainValidStudyParticipationDto),
    ),
  ).toEqual(plainValidStudyParticipationDto)
})

it('should accept a valid dto', async () => {
  await expect(
    validateOrReject(validStudyParticipationDto),
  ).resolves.toBeUndefined()
})

it('should reject a missing ID', async () => {
  await expect(
    validateOrReject(
      plainToInstance(StudyParticipationDto, {
        ...plainValidStudyParticipationDto,
        id: undefined,
      }),
    ),
  ).rejects.toBeDefined()
})

it('should reject an empty ID', async () => {
  await expect(
    validateOrReject(
      plainToInstance(StudyParticipationDto, {
        ...plainValidStudyParticipationDto,
        id: '',
      }),
    ),
  ).rejects.toBeDefined()
})

it('should reject a missing study ID', async () => {
  await expect(
    validateOrReject(
      plainToInstance(StudyParticipationDto, {
        ...plainValidStudyParticipationDto,
        studyId: undefined,
      }),
    ),
  ).rejects.toBeDefined()
})

it('should reject an empty study ID', async () => {
  await expect(
    validateOrReject(
      plainToInstance(StudyParticipationDto, {
        ...plainValidStudyParticipationDto,
        studyId: '',
      }),
    ),
  ).rejects.toBeDefined()
})

it('should reject a missing user ID', async () => {
  await expect(
    validateOrReject(
      plainToInstance(StudyParticipationDto, {
        ...plainValidStudyParticipationDto,
        userId: undefined,
      }),
    ),
  ).rejects.toBeDefined()
})

it('should reject an empty user ID', async () => {
  await expect(
    validateOrReject(
      plainToInstance(StudyParticipationDto, {
        ...plainValidStudyParticipationDto,
        userId: '',
      }),
    ),
  ).rejects.toBeDefined()
})

it('should reject missing assignmentCompletion IDs', async () => {
  await expect(
    validateOrReject(
      plainToInstance(StudyParticipationDto, {
        ...plainValidStudyParticipationDto,
        assignmentCompletionIds: undefined,
      }),
    ),
  ).rejects.toBeDefined()
})

it('should reject a missing assignmentCompletion ID', async () => {
  await expect(
    validateOrReject(
      plainToInstance(StudyParticipationDto, {
        ...plainValidStudyParticipationDto,
        assignmentCompletionIds: [undefined],
      }),
    ),
  ).rejects.toBeDefined()
})

it('should reject an empty assignmentCompletion ID', async () => {
  await expect(
    validateOrReject(
      plainToInstance(StudyParticipationDto, {
        ...plainValidStudyParticipationDto,
        assignmentCompletionIds: [''],
      }),
    ),
  ).rejects.toBeDefined()
})
