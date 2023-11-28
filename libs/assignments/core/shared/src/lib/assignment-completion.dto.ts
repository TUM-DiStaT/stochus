import { Exclude, Expose, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsUUID,
  MaxDate,
  ValidateNested,
} from 'class-validator'
import { InteractionLogForDownloadDto } from '@stochus/interaction-logs/dtos'

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

  @Expose()
  @IsBoolean()
  isForStudy!: boolean
}

export class AssignmentCompletionWithInteractionLogsDto extends AssignmentCompletionDto {
  @Expose()
  @Type(() => InteractionLogForDownloadDto)
  @ValidateNested({ each: true })
  @IsArray()
  interactionLogs!: InteractionLogForDownloadDto[]

  @Exclude()
  override isForStudy!: boolean
}
