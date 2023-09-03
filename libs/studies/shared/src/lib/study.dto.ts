import { Expose, Type } from 'class-transformer'
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator'
import { IsBefore } from '@stochus/core/shared'

export class StudyTaskDto {
  @Expose()
  @IsString()
  assignmentId!: string

  @Expose()
  @IsNumber()
  assignmentVersion!: number

  @Expose()
  config: unknown
}

export class StudyCreateDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name!: string

  @Type(() => Date)
  @IsDate()
  @IsBefore<StudyCreateDto>('endDate')
  @Expose()
  startDate!: Date

  @Type(() => Date)
  @IsDate()
  @Expose()
  endDate!: Date

  @Expose()
  @IsString()
  @IsNotEmpty()
  description!: string

  @Expose()
  @Type(() => StudyTaskDto)
  @ValidateNested({ each: true })
  tasks!: Array<StudyTaskDto>
}

export class StudyDto extends StudyCreateDto {
  @IsMongoId()
  @Expose()
  id!: string

  @Expose()
  @IsString()
  ownerId!: string
}
