import { chiSquared, minimumProbabilityD6IsUnfair } from './chi-squared'

describe('chiSquared', () => {
  it('should compute chiSquared correctly', () => {
    const observed = [1, 2, 3, 4, 5]
    const expected = [1, 2, 3, 4, 5]
    expect(chiSquared(observed, expected)).toBe(0)

    const observed2 = [6, 0, 0, 0, 0, 0]
    const expected2 = [1, 1, 1, 1, 1, 1]
    expect(chiSquared(observed2, expected2)).toBe(30)
  })

  it('should throw if observed and expected have different lengths', () => {
    const observed = [1, 2, 3, 4, 5]
    const expected = [1, 2, 3, 4]
    expect(() => chiSquared(observed, expected)).toThrow()
  })

  it('should throw if observed and expected have different sums', () => {
    const observed = [1, 2, 3, 4]
    const expected = [1, 2, 3, 5]
    expect(() => chiSquared(observed, expected)).toThrow()
  })
})

it('should categorize unfair dice as unfair with high certainty', () => {
  const frequencies = Array.from(
    {
      length: 6,
    },
    (_, i) => (i === 0 ? 100 : 0),
  )
  expect(minimumProbabilityD6IsUnfair(frequencies)).toBeGreaterThanOrEqual(
    0.999,
  )
})

it('should categorize fair dice as unlikely to be unfair', () => {
  const frequencies = Array.from(
    {
      length: 6,
    },
    () => 20,
  )
  expect(minimumProbabilityD6IsUnfair(frequencies)).toBeLessThanOrEqual(0.01)
})
