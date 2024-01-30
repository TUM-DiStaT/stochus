import { Expose, Transform, Type } from 'class-transformer'
import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator'

export enum StudentGender {
  MALE = 'male',
  FEMALE = 'female',
  DIVERSE = 'diverse',
}

export class StudentMetadata {
  @Expose()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dateOfBirth?: Date

  @Expose()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  grade?: number

  @Expose()
  @IsEnum(StudentGender)
  @IsOptional()
  gender?: StudentGender
}
