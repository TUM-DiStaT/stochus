import { Expose, Type } from 'class-transformer'
import { IsDate, IsMongoId, IsNotEmpty, IsUUID, MaxDate } from 'class-validator'

export class AssignmentCompletionDto {
  @IsMongoId()
  @Expose({ name: '_id' })
  @Type(() => String)
  id!: string

  @IsNotEmpty()
  @IsUUID()
  userId!: string

  // @IsIn(
  //   AssignmentsCoreBackendService.getAllAssignments().map(
  //     (assignment) => assignment.id,
  //   ),
  // )
  @Expose()
  assignmentId!: string

  @IsDate()
  @MaxDate(() => new Date())
  @Type(() => Date)
  @Expose()
  createdAt!: Date

  @IsDate()
  @MaxDate(() => new Date())
  @Type(() => Date)
  @Expose()
  lastUpdated!: Date

  @Expose()
  @IsNotEmpty()
  config: unknown

  @Expose()
  @IsNotEmpty()
  completionData: unknown
}
