import { BaseAssignment } from './base-assignment'
import { assertUniqueIds } from './sanity-checks'

describe('assertUniqueIds', () => {
  const generateAssignment = (
    overrides: Partial<BaseAssignment>,
  ): BaseAssignment => ({
    id: 'some-testing-assignment',
    name: 'Some testing assignment',
    description: 'Some testing description',
    version: -1,
    completionDataClass: class CompletionData {
      progress!: number
    },
    configurationClass: class CompletionData {},
    ...overrides,
  })

  const generateAssignmentWithId = (id: string) => generateAssignment({ id })

  it('should not throw an error when called with []', () => {
    expect(() => assertUniqueIds([])).not.toThrow()
  })

  it('should not throw an error when called with all unique IDs', () => {
    expect(() =>
      assertUniqueIds([
        generateAssignmentWithId('first-id'),
        generateAssignmentWithId('second-id'),
        generateAssignmentWithId('third-id'),
      ]),
    ).not.toThrow()
  })

  it('should throw an error when two identical ids exist', () => {
    expect(() =>
      assertUniqueIds([
        generateAssignmentWithId('first-id'),
        generateAssignmentWithId('second-id'),
        generateAssignmentWithId('third-id'),
        generateAssignmentWithId('second-id'),
      ]),
    ).toThrow()
  })
})
