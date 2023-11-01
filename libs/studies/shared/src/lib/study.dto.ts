import { Expose, Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
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

class StudyForParticipationWithoutId {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name!: string

  @Type(() => Date)
  @IsDate()
  @IsBefore<StudyForParticipationWithoutId>('endDate')
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
}

export class StudyCreateDto extends StudyForParticipationWithoutId {
  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  randomizeTaskOrder!: boolean

  @Expose()
  @IsUUID()
  @IsNotEmpty()
  participantsGroupId!: string

  @Expose()
  @Type(() => StudyTaskDto)
  @ValidateNested({ each: true })
  tasks!: Array<StudyTaskDto>
}

export class StudyUpdateDto extends StudyCreateDto {}

export class StudyDto extends StudyCreateDto {
  @IsMongoId()
  @Expose()
  id!: string

  @Expose()
  @IsString()
  ownerId!: string
}

export class StudyForParticipationDto extends StudyForParticipationWithoutId {
  @IsMongoId()
  @Expose()
  id!: string
}
