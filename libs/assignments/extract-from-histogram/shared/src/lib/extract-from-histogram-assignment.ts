import { Expose } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator'
import { random } from 'lodash'
import {
  BaseAssignment,
  BaseCompletionData,
  emptyBaseCompletionData,
} from '@stochus/assignments/model/shared'

export const extractableProperties = ['mean', 'median'] as const
export type ExtractableProperty = (typeof extractableProperties)[number]

export class ExtractFromHistogramAssignmentConfiguration {
  @Expose()
  @IsEnum(extractableProperties)
  targetProperty!: ExtractableProperty

  @Expose()
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  data!: number[]
}

export class ExtractFromHistogramAssignmentCompletionData extends BaseCompletionData {
  @Expose()
  @IsNumber()
  @IsOptional()
  result?: number
}

export const initialExtractFromHistogramAssignmentCompletionData = {
  ...emptyBaseCompletionData,
  result: 0,
} satisfies ExtractFromHistogramAssignmentCompletionData

export const ExtractFromHistogramAssignment: BaseAssignment<
  ExtractFromHistogramAssignmentConfiguration,
  ExtractFromHistogramAssignmentCompletionData
> = {
  id: 'ExtractFromHistogramAssignment',
  name: 'Kennwerte aus Histogramm extrahieren',
  version: 0,
  description: 'Extrahiere den Mittelwert oder Median aus einem Histogramm.',
  getInitialCompletionData: () =>
    initialExtractFromHistogramAssignmentCompletionData,
  getRandomConfig: () => {
    const lowerBound = random(1, 100)
    const upperBound = random(lowerBound + 1, lowerBound + 10)

    return {
      targetProperty: Math.random() > 0.5 ? 'mean' : 'median',
      data: Array.from({ length: random(10, 100) }, () =>
        random(lowerBound, upperBound),
      ),
    }
  },
  configurationClass: ExtractFromHistogramAssignmentConfiguration,
  completionDataClass: ExtractFromHistogramAssignmentCompletionData,
}
