import { Expose, Type } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
} from 'class-validator'
import {
  BaseAssignment,
  BaseCompletionData,
  emptyBaseCompletionData,
} from '@stochus/assignments/model/shared'
import {
  generateDatasetsWithIdenticalMean,
  generateDatasetsWithIdenticalMedian,
} from './generate-datasets'

const extractableCharacteristics = ['mean', 'median'] as const
type ExtractableCharacteristic = (typeof extractableCharacteristics)[number]

class Dataset {
  @Expose()
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  data!: number[]
}

export class IdentifySharedCharacteristicsAssignmentConfiguration {
  @Expose()
  @IsEnum(extractableCharacteristics)
  targetCharacteristic!: ExtractableCharacteristic

  @Expose()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Dataset)
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  datasets!: Dataset[]

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
  ...emptyBaseCompletionData,
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
      datasets: datasets.map((data) => ({ data })),
      randomizeDatasetOrder: Math.random() > 0.5,
    } satisfies IdentifySharedCharacteristicsAssignmentConfiguration
  },
  configurationClass: IdentifySharedCharacteristicsAssignmentConfiguration,
  completionDataClass: IdentifySharedCharacteristicsAssignmentCompletionData,
}
