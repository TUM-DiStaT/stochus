import { Expose } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
} from 'class-validator'
import { random } from 'lodash'
import {
  BaseAssignment,
  BaseCompletionData,
} from '@stochus/assignments/model/shared'

const extractableCharacteristics = ['mean', 'median'] as const
type ExtractableCharacteristic = (typeof extractableCharacteristics)[number]

type Datasets = [number[], number[], number[], number[]]

export class IdentifySharedCharacteristicsAssignmentConfiguration {
  @Expose()
  @IsEnum(extractableCharacteristics)
  targetCharacteristic!: ExtractableCharacteristic

  @Expose()
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  datasets!: Datasets

  @Expose()
  @IsBoolean()
  randomizeDatasetOrder!: boolean
}

export class IdentifySharedCharacteristicsAssignmentCompletionData extends BaseCompletionData {
  @Expose()
  @Expose()
  @IsArray()
  @IsNumber({}, { each: true })
  selectedDatasets!: number[]
}

const initialIdentifySharedCharacteristicsAssignmentCompletionData = {
  ...new BaseCompletionData(),
  selectedDatasets: [],
} satisfies IdentifySharedCharacteristicsAssignmentCompletionData

const generateDatasetsWithIdenticalMedian = (): Datasets => {
  const median = random(5, 95)

  return Array.from({ length: 4 }, (): number[] => {
    const range = random(5, 20)
    const length = random(10, 100)
    const lowerBound = random(median - range, median - 1)
    const upperBound = lowerBound + range

    const lowerHalf = Array.from({ length: Math.ceil(length / 2) - 1 }, () =>
      random(lowerBound, median),
    )

    const upperHalf = Array.from({ length: Math.ceil(length / 2) }, () =>
      random(median, upperBound),
    )

    return [...lowerHalf, median, ...upperHalf]
  }) as Datasets
}

const calculateMean = (dataset: number[]): number =>
  dataset.reduce((sum, value) => sum + value, 0) / dataset.length

const generateDatasetsWithIdenticalMean = (): Datasets => {
  const desiredMean = random(5, 95)

  return Array.from({ length: 4 }, (): number[] => {
    const range = random(5, 20)
    // this length will probably not be reached exactly
    const roughTargetLength = random(10, 100)
    const lowerBound = random(desiredMean - range, desiredMean - 1)
    const upperBound = lowerBound + range

    const result = Array.from({ length: roughTargetLength / 2 }, () =>
      random(lowerBound, upperBound),
    )

    for (
      let actualMean = calculateMean(result), i = 0;
      actualMean !== desiredMean && i < 1000;
      actualMean = calculateMean(result), i++
    ) {
      // Searching for the "missing element" x so that the actual mean is the desired mean:
      // curr * n + x = mean * (n + 1)
      const requiredForDesiredMean =
        desiredMean * (result.length + 1) - actualMean * result.length

      if (
        lowerBound <= requiredForDesiredMean &&
        requiredForDesiredMean <= upperBound
      ) {
        result.push(requiredForDesiredMean)
      } else if (requiredForDesiredMean < lowerBound) {
        result.push(random(lowerBound, desiredMean))
      } else {
        result.push(random(desiredMean, upperBound))
      }
    }

    return result
  }) as Datasets
}

export const IdentifySharedCharacteristicsAssignment: BaseAssignment<
  IdentifySharedCharacteristicsAssignmentConfiguration,
  IdentifySharedCharacteristicsAssignmentCompletionData
> = {
  id: 'IdentifySharedCharacteristicsAssignment',
  name: 'Histogramme mit gleichen Kennwerten identifizieren',
  version: 0,
  description:
    'Identifiziere welche Histogramme in einem bestimmten Kennwert übereinstimmen.',
  getInitialCompletionData: () =>
    initialIdentifySharedCharacteristicsAssignmentCompletionData,
  getRandomConfig: () => {
    const targetCharacteristic = Math.random() > 0.5 ? 'mean' : 'median'
    const datasets =
      targetCharacteristic === 'mean'
        ? generateDatasetsWithIdenticalMean()
        : generateDatasetsWithIdenticalMedian()

    return {
      targetCharacteristic,
      datasets,
      randomizeDatasetOrder: Math.random() > 0.5,
    } satisfies IdentifySharedCharacteristicsAssignmentConfiguration
  },
  configurationClass: IdentifySharedCharacteristicsAssignmentConfiguration,
  completionDataClass: IdentifySharedCharacteristicsAssignmentCompletionData,
}
