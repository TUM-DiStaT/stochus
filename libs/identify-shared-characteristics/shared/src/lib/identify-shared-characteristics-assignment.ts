import { Expose } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
} from 'class-validator'
import {
  BaseAssignment,
  BaseCompletionData,
} from '@stochus/assignments/model/shared'
import {
  Datasets,
  generateDatasetsWithIdenticalMean,
  generateDatasetsWithIdenticalMedian,
} from './generate-datasets'

const extractableCharacteristics = ['mean', 'median'] as const
type ExtractableCharacteristic = (typeof extractableCharacteristics)[number]

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
