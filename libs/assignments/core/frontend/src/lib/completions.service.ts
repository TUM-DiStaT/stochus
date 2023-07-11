import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, map } from 'rxjs'
import { AssignmentCompletionDto } from '@stochus/assignment/core/shared'
import { BaseCompletionData } from '@stochus/assignments/model/shared'
import { plainToInstance } from '@stochus/core/shared'

@Injectable({
  providedIn: 'root',
})
export class CompletionsService {
  readonly baseUrl = '/api/assignments/completions'

  constructor(private readonly http: HttpClient) {}

  getActive(
    assignmentId: string,
  ): Observable<AssignmentCompletionDto | undefined> {
    return this.http
      .get<AssignmentCompletionDto | undefined>(
        `${this.baseUrl}/${assignmentId}/active`,
      )
      .pipe(
        map((completion) =>
          plainToInstance(AssignmentCompletionDto, completion),
        ),
      )
  }

  getAllActive(): Observable<Array<AssignmentCompletionDto>> {
    return this.http
      .get<Array<AssignmentCompletionDto>>(`${this.baseUrl}/active`)
      .pipe(
        map((completions) =>
          plainToInstance(AssignmentCompletionDto, completions),
        ),
      )
  }

  createNewForAssignment(
    assignmentId: string,
  ): Observable<AssignmentCompletionDto | undefined> {
    return this.http
      .post<AssignmentCompletionDto | undefined>(
        `${this.baseUrl}/${assignmentId}`,
        {},
      )
      .pipe(
        map((completion) =>
          plainToInstance(AssignmentCompletionDto, completion),
        ),
      )
  }

  getById(
    completionId: string,
  ): Observable<AssignmentCompletionDto | undefined> {
    return this.http
      .get<AssignmentCompletionDto | undefined>(
        `${this.baseUrl}/${completionId}`,
        {},
      )
      .pipe(
        map((completion) =>
          plainToInstance(AssignmentCompletionDto, completion),
        ),
      )
  }

  updateCompletionData(
    completionId: string,
    update: Partial<BaseCompletionData>,
  ) {
    return this.http
      .put(`${this.baseUrl}/${completionId}/completionData`, update)
      .pipe(
        map((completion) =>
          plainToInstance(AssignmentCompletionDto, completion),
        ),
      )
  }
}
