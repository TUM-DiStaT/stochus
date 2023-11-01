import { validateOrReject } from 'class-validator'
import 'reflect-metadata'
import { plainToInstance } from '@stochus/core/shared'
import { validStudyDto } from './studies.dto.fixture'
import { StudyDto } from './study.dto'

describe('parsing and validation', () => {
  const fromJson = JSON.parse(JSON.stringify(validStudyDto))

  it('should correctly parse and validate the valid fixture', async () => {
    const parsed = plainToInstance(StudyDto, validStudyDto)
    await expect(validateOrReject(parsed)).resolves.not.toThrow()
  })

  it('should preserve the config', () => {
    expect(plainToInstance(StudyDto, fromJson).tasks[0].config).toEqual(
      validStudyDto.tasks[0].config,
    )
  })

  it("should fail when dates aren't in correct order", async () => {
    const withMessedUpDates: StudyDto = {
      ...fromJson,
      startDate: new Date(2023, 1, 10),
      endDate: new Date(2023, 1, 1),
    }

    const parsed = plainToInstance(StudyDto, withMessedUpDates)

    await expect(validateOrReject(parsed)).rejects.toBeDefined()
  })

  it('validates each of the tasks', async () => {
    const withIncompleteTask = {
      ...fromJson,
      tasks: [...fromJson.tasks, {}],
    }
    const parsed = plainToInstance(StudyDto, withIncompleteTask)

    await expect(validateOrReject(parsed)).rejects.toBeDefined()
  })
})
