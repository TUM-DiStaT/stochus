import { validate } from 'class-validator'
import { IsBefore } from './is-before-validator'

class TestData {
  @IsBefore<TestData>('after')
  before: Date
  after: Date

  constructor(before: Date, after: Date) {
    this.before = before
    this.after = after
  }
}

it('should allow a valid before and after date', async () => {
  await expect(
    validate(new TestData(new Date(2023, 8, 1), new Date(2023, 8, 2))),
  ).resolves.toHaveLength(0)
})

it('should forbid an invalid before and after date', async () => {
  await expect(
    validate(new TestData(new Date(2023, 8, 3), new Date(2023, 8, 2))),
  ).resolves.not.toHaveLength(0)
})
