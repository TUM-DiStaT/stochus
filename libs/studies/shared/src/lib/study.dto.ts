import { Expose, Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'
import { IsBefore } from '@stochus/core/shared'
import { StudyParticipationWithAssignmentCompletionsDto } from './participation/study-participation.dto'

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
  @Expose({ name: '_id' })
  @Type(() => String)
  id!: string

  @Expose()
  @IsString()
  ownerId!: string

  @Expose()
  @IsNumber()
  @Min(0)
  numberOfParticipants = 0

  @Expose()
  @IsNumber()
  @Min(0)
  numberOfStartedParticipations = 0

  @Expose()
  @IsNumber()
  @Min(0)
  numberOfCompletedParticipations = 0

  @Expose()
  @IsNumber()
  @Min(0)
  @Max(1)
  overallProgress = 0

  @Expose()
  @IsBoolean()
  hasInteractionLogs = false
}

export class StudyForParticipationDto extends StudyForParticipationWithoutId {
  @IsMongoId()
  @Expose({ name: '_id' })
  @Type(() => String)
  id!: string

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => StudyParticipationWithAssignmentCompletionsDto)
  participation?: StudyParticipationWithAssignmentCompletionsDto
}
