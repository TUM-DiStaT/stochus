import { Exclude, Expose, Type } from 'class-transformer'
import { IsDate, IsMongoId, IsNotEmpty, IsUUID, MaxDate } from 'class-validator'

export class InteractionLogCreateDto {
  @Expose()
  @IsMongoId()
  @Type(() => String)
  assignmentCompletionId!: string

  @Expose()
  @IsNotEmpty()
  payload!: unknown
}

export class InteractionLogDto extends InteractionLogCreateDto {
  @IsMongoId()
  @Expose({ name: '_id' })
  @Type(() => String)
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

export class InteractionLogForDownloadDto extends InteractionLogDto {
  @Exclude()
  override assignmentCompletionId!: string

  @Exclude()
  override userId!: string
}
