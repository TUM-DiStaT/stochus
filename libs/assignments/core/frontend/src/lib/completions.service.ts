import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, map } from 'rxjs'
import { AssignmentCompletionDto } from '@stochus/assignment/core/shared'
import { plainToInstance } from '@stochus/core/shared'

@Injectable({
  providedIn: 'root',
})
export class CompletionsService {
  readonly baseUrl = '/api/assignments/completions'

  constructor(private readonly http: HttpClient) {}

  getRecentForAssignment(): Observable<AssignmentCompletionDto | undefined> {
    return this.http
      .get<AssignmentCompletionDto | undefined>(
        `${this.baseUrl}/GuessRandomNumberAssignment/active`,
      )
      .pipe(
        map((completion) =>
          plainToInstance(AssignmentCompletionDto, completion),
        ),
      )
  }

  getActive(): Observable<Array<AssignmentCompletionDto>> {
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
}
