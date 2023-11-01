import { Expose, Type } from 'class-transformer'
import { IsArray, IsMongoId, IsUUID } from 'class-validator'

export class StudyParticipationCreateDto {
  @Expose()
  @IsMongoId()
  studyId!: string

  @Expose()
  @IsUUID()
  userId!: string

  @Expose()
  @IsArray()
  @IsMongoId({ each: true })
  assignmentCompletionIds!: string[]
}

export class StudyParticipationDto extends StudyParticipationCreateDto {
  @Expose({ name: '_id' })
  @Type(() => String)
  @IsMongoId()
  id!: string
}
