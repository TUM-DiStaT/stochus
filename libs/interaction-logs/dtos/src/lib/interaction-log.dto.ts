import { OmitType } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsDate, IsMongoId, IsNotEmpty, IsUUID, MaxDate } from 'class-validator'

export class InteractionLogDto {
  @IsMongoId()
  @Expose()
  id!: string

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
  'id',
  'userId',
  'datetime',
] as const) {}
