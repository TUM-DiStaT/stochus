import { Expose, Type } from 'class-transformer'
import {
  IsArray,
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
import {
  StudyParticipationWithAssignmentCompletionsAndLogsDto,
  StudyParticipationWithAssignmentCompletionsDto,
} from './participation/study-participation.dto'

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

  @Expose()
  @IsString()
  @IsNotEmpty()
  messageAfterFeedback!: string
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

export class BaseStudyDto extends StudyCreateDto {
  @IsMongoId()
  @Expose({ name: '_id' })
  @Type(() => String)
  id!: string

  @Expose()
  @IsString()
  ownerId!: string
}

export class StudyDto extends BaseStudyDto {
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

  isActive() {
    const now = new Date().valueOf()
    return this.startDate.valueOf() <= now && now <= this.endDate.valueOf()
  }
}

export class StudyForDownloadDto extends BaseStudyDto {
  @Expose()
  @Type(() => StudyParticipationWithAssignmentCompletionsAndLogsDto)
  @ValidateNested({ each: true })
  @IsArray()
  participations!: StudyParticipationWithAssignmentCompletionsAndLogsDto[]
}

export class StudyFeedbackDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  messageAfterFeedback!: string
}
