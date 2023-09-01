import { OmitType } from '@nestjs/mapped-types'
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

export class StudyDto {
  @IsMongoId()
  @Expose()
  id!: string

  @Expose()
  @IsString()
  ownerId!: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  name!: string

  @Type(() => Date)
  @IsDate()
  @IsBefore<StudyDto>('endDate')
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

export class StudyCreateDto extends OmitType(StudyDto, ['id', 'ownerId']) {}
