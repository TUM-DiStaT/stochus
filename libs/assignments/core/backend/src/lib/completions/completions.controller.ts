import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from 'nest-keycloak-connect'
import { AssignmentCompletionDto } from '@stochus/assignment/core/shared'
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
    const created = await this.completionsService.createForAssignment(
      assignmentId,
      user,
    )
    return plainToInstance(AssignmentCompletionDto, created)
  }
}
