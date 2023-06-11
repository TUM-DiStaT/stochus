import { IsDate, IsMongoId, IsNotEmpty, IsUUID, MaxDate } from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { OmitType } from '@nestjs/swagger'

export class InteractionLogDto {
  @IsMongoId()
  @Expose()
  _id!: string

  @IsDate()
  @MaxDate(() => new Date())
  @Type(() => Date)
  @Expose()
  datetime!: Date

  @Expose()
  @IsNotEmpty()
  payload: unknown

  @IsNotEmpty()
  @IsUUID()
  userId!: string
}

export class InteractionLogCreateDto extends OmitType(InteractionLogDto, [
  '_id',
  'userId',
  'datetime',
] as const) {}
