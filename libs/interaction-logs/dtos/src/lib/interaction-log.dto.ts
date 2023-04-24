import { IsMongoId } from 'class-validator'
import { Expose } from 'class-transformer'

export class InteractionLogDto {
  @IsMongoId()
  @Expose()
  _id!: string
}
