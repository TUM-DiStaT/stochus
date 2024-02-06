import { validateOrReject } from 'class-validator'
import { plainToInstance } from '@stochus/core/shared'
import {
  DetermineDiceFairnessAssignment,
  DetermineDiceFairnessAssignmentCompletionData,
  DetermineDiceFairnessAssignmentConfiguration,
} from './determine-dice-fairness-assignment'

describe('DetermineDiceFairnessAssignmentConfiguration', () => {
  it('should accept a random config', async () => {
    await expect(
      validateOrReject(
        plainToInstance(
          DetermineDiceFairnessAssignmentConfiguration,
          DetermineDiceFairnessAssignment.getRandomConfig(),
        ),
      ),
    ).resolves.toBeUndefined()
  })

  it('should reject invalid proportions', async () => {
    await expect(
      validateOrReject(
        plainToInstance(DetermineDiceFairnessAssignmentConfiguration, {
          ...DetermineDiceFairnessAssignment.getRandomConfig(),
          // 5 elements
          proportions: 1,
        }),
      ),
    ).rejects.toHaveLength(1)
    await expect(
      validateOrReject(
        plainToInstance(DetermineDiceFairnessAssignmentConfiguration, {
          ...DetermineDiceFairnessAssignment.getRandomConfig(),
          // 7 elements
          proportions: [1, 1, 1, 1, '1', 1],
        }),
      ),
    ).rejects.toHaveLength(1)
  })

  it('should deny an invalid proportions list', async () => {
    await expect(
      validateOrReject(
        plainToInstance(DetermineDiceFairnessAssignmentConfiguration, {
          ...DetermineDiceFairnessAssignment.getRandomConfig(),
          // 5 elements
          proportions: [1, 1, 1, 1, 1],
        }),
      ),
    ).rejects.toHaveLength(1)
    await expect(
      validateOrReject(
        plainToInstance(DetermineDiceFairnessAssignmentConfiguration, {
          ...DetermineDiceFairnessAssignment.getRandomConfig(),
          // 7 elements
          proportions: [1, 1, 1, 1, 1, 1, 1],
        }),
      ),
    ).rejects.toHaveLength(1)
  })

  it('rejects invalid dicePerRoll', async () => {
    await expect(
      validateOrReject(
        plainToInstance(DetermineDiceFairnessAssignmentConfiguration, {
          ...DetermineDiceFairnessAssignment.getRandomConfig(),
          dicePerRoll: '1',
        }),
      ),
    ).rejects.toHaveLength(1)

    await expect(
      validateOrReject(
        plainToInstance(DetermineDiceFairnessAssignmentConfiguration, {
          ...DetermineDiceFairnessAssignment.getRandomConfig(),
          dicePerRoll: NaN,
        }),
      ),
    ).rejects.toHaveLength(1)

    await expect(
      validateOrReject(
        plainToInstance(DetermineDiceFairnessAssignmentConfiguration, {
          ...DetermineDiceFairnessAssignment.getRandomConfig(),
          dicePerRoll: 0,
        }),
      ),
    ).rejects.toHaveLength(1)
  })
})

describe('DetermineDiceFairnessAssignmentCompletionData', () => {
  it('should accept a initial completion data', async () => {
    await expect(
      validateOrReject(
        plainToInstance(
          DetermineDiceFairnessAssignmentCompletionData,
          DetermineDiceFairnessAssignment.getInitialCompletionData(),
        ),
      ),
    ).resolves.toBeUndefined()
  })

  it('should reject invalid resultFrequencies', async () => {
    await expect(
      validateOrReject(
        plainToInstance(DetermineDiceFairnessAssignmentCompletionData, {
          ...DetermineDiceFairnessAssignment.getInitialCompletionData(),
          resultFrequencies: 1,
        }),
      ),
    ).rejects.toHaveLength(1)
    await expect(
      validateOrReject(
        plainToInstance(DetermineDiceFairnessAssignmentCompletionData, {
          ...DetermineDiceFairnessAssignment.getInitialCompletionData(),
          resultFrequencies: ['1', '1', '1', '1', '1', '1'],
        }),
      ),
    ).rejects.toHaveLength(1)
    await expect(
      validateOrReject(
        plainToInstance(DetermineDiceFairnessAssignmentCompletionData, {
          ...DetermineDiceFairnessAssignment.getInitialCompletionData(),
          // 7 elements
          resultFrequencies: [0, 0, 0, 0, 0, 0, 0],
        }),
      ),
    ).rejects.toHaveLength(1)
    await expect(
      validateOrReject(
        plainToInstance(DetermineDiceFairnessAssignmentCompletionData, {
          ...DetermineDiceFairnessAssignment.getInitialCompletionData(),
          resultFrequencies: [0, 0, 0, 0, 0, -1],
        }),
      ),
    ).rejects.toHaveLength(1)
  })
})
