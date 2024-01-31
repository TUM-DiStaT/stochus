import { determineDiceFairnessAssignmentShared } from './determine-dice-fairness-assignment-shared'

describe('determineDiceFairnessAssignmentShared', () => {
  it('should work', () => {
    expect(determineDiceFairnessAssignmentShared()).toEqual(
      'determine-dice-fairness-shared',
    )
  })
})
