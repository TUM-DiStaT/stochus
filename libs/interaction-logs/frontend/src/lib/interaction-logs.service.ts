import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs'
import { plainToInstance } from '@stochus/core/shared'
import {
  InteractionLogCreateDto,
  InteractionLogDto,
} from '@stochus/interaction-logs/dtos'

@Injectable({
  providedIn: 'root',
})
export class InteractionLogsService {
  static readonly baseUlr = 'api/interaction-logs'

  constructor(private readonly http: HttpClient) {}

  log(assignmentCompletionId: string, dto: InteractionLogCreateDto) {
    return this.http
      .post(
        `${InteractionLogsService.baseUlr}/assignment-completion/${assignmentCompletionId}`,
        dto,
      )
      .pipe(map((x) => plainToInstance(InteractionLogDto, x)))
  }
}
