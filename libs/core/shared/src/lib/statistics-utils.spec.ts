import { calculateMean, calculateMedian } from './statistics-utils'

describe('mean', () => {
  it('should compute correct mean for even amount of data points', () => {
    const data = [1, 2, 3, 4]
    const mean = calculateMean(data)
    expect(mean).toEqual(2.5)
  })

  it('should compute correct mean for odd amount of data points', () => {
    const data = [1, 2, 6]
    const mean = calculateMean(data)
    expect(mean).toEqual(3)
  })
})

describe('median', () => {
  it('should compute correct median for even amount of data points', () => {
    const data = [1, 2, 3, 4]
    const median = calculateMedian(data)
    expect(median).toEqual(2)
  })

  it('should compute correct median for odd amount of data points', () => {
    const data = [1, 4, 5]
    const median = calculateMedian(data)
    expect(median).toEqual(4)
  })
})
