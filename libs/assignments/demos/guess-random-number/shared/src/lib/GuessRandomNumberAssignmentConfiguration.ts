import { IsNumber } from 'class-validator'

export class GuessRandomNumberAssignmentConfiguration {
  @IsNumber()
  result!: number
}
