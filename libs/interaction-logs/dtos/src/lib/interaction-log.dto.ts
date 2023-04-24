import { IsDate, IsMongoId, IsNotEmpty, MaxDate } from 'class-validator'
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
  payload: unknown

  @IsNotEmpty()
  userId!: string
}

export class InteractionLogCreateDto extends OmitType(InteractionLogDto, [
  '_id',
  'userId',
  'datetime',
] as const) {}
