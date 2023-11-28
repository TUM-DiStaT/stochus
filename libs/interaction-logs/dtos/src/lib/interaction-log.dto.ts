import { Expose, Type } from 'class-transformer'
import { IsDate, IsMongoId, IsNotEmpty, IsUUID, MaxDate } from 'class-validator'

export class InteractionLogCreateDto {
  @Expose()
  @IsMongoId()
  assignmentCompletionId!: string

  @Expose()
  @IsNotEmpty()
  payload!: unknown
}

export class InteractionLogDto extends InteractionLogCreateDto {
  @IsMongoId()
  @Expose({ name: '_id' })
  id!: string

  @IsDate()
  @MaxDate(() => new Date())
  @Type(() => Date)
  @Expose()
  datetime!: Date

  @IsNotEmpty()
  @IsUUID()
  userId!: string
}
