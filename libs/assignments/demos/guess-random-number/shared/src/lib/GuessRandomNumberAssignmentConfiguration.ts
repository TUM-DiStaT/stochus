import { Expose } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class GuessRandomNumberAssignmentConfiguration {
  @IsNumber()
  @Expose()
  result!: number
}
