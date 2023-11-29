import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from 'nest-keycloak-connect'
import { AssignmentCompletionDto } from '@stochus/assignment/core/shared'
import { BaseCompletionData } from '@stochus/assignments/model/shared'
import { User } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { ParsedUser } from '@stochus/auth/backend'
import { CompletionsService } from './completions.service'

@Controller('assignments/completions')
export class CompletionsController {
  constructor(private readonly completionsService: CompletionsService) {}

  @Get('active')
  @UseGuards(AuthGuard)
  async getAllActive(@ParsedUser() user: User) {
    const completions = await this.completionsService.getAllActive(user)

    return plainToInstance(AssignmentCompletionDto, completions)
  }

  @Get(':completionId')
  @UseGuards(AuthGuard)
  async getById(@Param() { completionId }: { completionId: string }) {
    const completion = await this.completionsService.getById(completionId)

    if (!completion) {
      throw new NotFoundException(`No completion found for ID ${completionId}`)
    }

    return plainToInstance(AssignmentCompletionDto, completion)
  }

  @Get(':assignmentId/active')
  @UseGuards(AuthGuard)
  async getActive(
    @Param() { assignmentId }: { assignmentId: string },
    @ParsedUser() user: User,
  ) {
    const completion = await this.completionsService.getMostRecentForAssignment(
      assignmentId,
      user,
    )

    if (!completion) {
      throw new NotFoundException(
        `No active completion found for ${assignmentId} and ${user.username} (${user.id})`,
      )
    }

    return plainToInstance(AssignmentCompletionDto, completion)
  }

  @Post(':assignmentId')
  @UseGuards(AuthGuard)
  async createForAssignment(
    @Param() { assignmentId }: { assignmentId: string },
    @ParsedUser() user: User,
  ) {
    const created = await this.completionsService.create(assignmentId, user)
    return plainToInstance(AssignmentCompletionDto, created)
  }

  @Put(':completionId/completionData')
  @UseGuards(AuthGuard)
  async updateCompletionData(
    @Param()
    {
      completionId,
    }: {
      completionId: string
    },
    @ParsedUser() user: User,
    @Body() update: Partial<BaseCompletionData>,
  ) {
    const updated = await this.completionsService.updateCompletionData(
      completionId,
      user,
      update,
    )
    return plainToInstance(AssignmentCompletionDto, updated)
  }
}
