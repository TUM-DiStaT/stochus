import { validate } from 'class-validator'
import 'reflect-metadata'
import { plainToInstance } from '@stochus/core/shared'
import { StudentMetadata } from './student-metadata'

it('should transform string values correctly', async () => {
  const instance = plainToInstance(StudentMetadata, {
    dateOfBirth: '2020-01-01',
    grade: '8',
    gender: 'male',
  })
  expect(instance).toMatchInlineSnapshot(`
    StudentMetadata {
      "dateOfBirth": 2020-01-01T00:00:00.000Z,
      "gender": "male",
      "grade": 8,
    }
  `)
  await expect(validate(instance)).resolves.toHaveLength(0)
})
