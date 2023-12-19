import { Exclude, Expose, Type } from 'class-transformer'
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxDate,
} from 'class-validator'

export class InteractionLogCreateDto {
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
  @Expose()
  @IsMongoId()
  @Type(() => String)
  @IsOptional()
  assignmentCompletionId?: string

  @Exclude()
  override userId!: string
}
