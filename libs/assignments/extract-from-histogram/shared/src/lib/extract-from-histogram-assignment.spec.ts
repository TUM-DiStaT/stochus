import { validate } from 'class-validator'
import { emptyBaseCompletionData } from '@stochus/assignments/model/shared'
import { plainToInstance } from '@stochus/core/shared'
import {
  ExtractFromHistogramAssignmentCompletionData,
  ExtractFromHistogramAssignmentConfiguration,
} from './extract-from-histogram-assignment'

describe('configuration linting & transformation', () => {
  it.each(['mean', 'median'])(
    'should transform correctly with targetProperty %p and verify as correct',
    async (targetProperty: string) => {
      const transformed = plainToInstance(
        ExtractFromHistogramAssignmentConfiguration,
        {
          targetProperty,
          data: [1, 2, 3],
        },
      )

      const errors = await validate(transformed)
      expect(errors).toHaveLength(0)
    },
  )

  it.each([undefined, null, 1, [], ['a']])(
    'should fail with data %p',
    async (data: unknown) => {
      const transformed = plainToInstance(
        ExtractFromHistogramAssignmentConfiguration,
        {
          targetProperty: 'mean',
          data,
        },
      )

      const errors = await validate(transformed)
      expect(errors).toHaveLength(1)
    },
  )

  it.each([undefined, null, 1, 'invalid'])(
    'should fail with targetProperty %p',
    async (targetProperty: unknown) => {
      const transformed = plainToInstance(
        ExtractFromHistogramAssignmentConfiguration,
        {
          targetProperty,
          data: [1, 2, 3],
        },
      )

      const errors = await validate(transformed)
      expect(errors).toHaveLength(1)
    },
  )
})

describe('completion data linting & transformation', () => {
  it('should fail validation if base data is missing', async () => {
    const transformed = plainToInstance(
      ExtractFromHistogramAssignmentCompletionData,
      {
        // no BaseCompletionData!
        result: 1,
      },
    )

    const errors = await validate(transformed)
    expect(errors.length).toBeGreaterThan(0)
  })

  it.each([undefined, null, 1])(
    'should transform correctly and verify as correct',
    async (result: unknown) => {
      const transformed = plainToInstance(
        ExtractFromHistogramAssignmentCompletionData,
        {
          ...emptyBaseCompletionData,
          result,
        },
      )

      const errors = await validate(transformed)
      expect(errors).toHaveLength(0)
    },
  )

  it.each(['invalid'])(
    'should fail with result %p',
    async (result: unknown) => {
      const transformed = plainToInstance(
        ExtractFromHistogramAssignmentCompletionData,
        {
          ...emptyBaseCompletionData,
          result,
        },
      )

      const errors = await validate(transformed)
      expect(errors).toHaveLength(1)
    },
  )
})
