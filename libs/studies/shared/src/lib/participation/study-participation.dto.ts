import { Exclude, Expose, Type } from 'class-transformer'
import { IsArray, IsMongoId, IsUUID, ValidateNested } from 'class-validator'
import {
  AssignmentCompletionDto,
  AssignmentCompletionWithInteractionLogsDto,
} from '@stochus/assignment/core/shared'

export class StudyParticipationCreateDto {
  @Expose()
  @Type(() => String)
  @IsMongoId()
  studyId!: string

  @Expose()
  @IsUUID()
  userId!: string

  @Expose()
  @IsArray()
  @Type(() => String)
  @IsMongoId({ each: true })
  assignmentCompletionIds!: string[]
}

export class StudyParticipationDto extends StudyParticipationCreateDto {
  @Expose({ name: '_id' })
  @Type(() => String)
  @IsMongoId()
  id!: string
}

export class StudyParticipationWithAssignmentCompletionsDto extends StudyParticipationDto {
  @Exclude()
  override assignmentCompletionIds!: string[]

  @Expose()
  @Type(() => AssignmentCompletionDto)
  @ValidateNested({ each: true })
  @IsArray()
  assignmentCompletions!: AssignmentCompletionDto[]
}

export class StudyParticipationWithAssignmentCompletionsAndLogsDto extends StudyParticipationDto {
  @Exclude()
  override assignmentCompletionIds!: string[]

  @Exclude()
  override studyId!: string

  @Exclude()
  override userId!: string

  @Expose()
  @Type(() => AssignmentCompletionWithInteractionLogsDto)
  @ValidateNested({ each: true })
  @IsArray()
  assignmentCompletions!: AssignmentCompletionWithInteractionLogsDto[]
}
