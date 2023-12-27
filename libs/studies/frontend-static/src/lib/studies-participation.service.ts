import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { map, switchMap } from 'rxjs'
import { fromPromise } from 'rxjs/internal/observable/innerFrom'
import { plainToInstance } from '@stochus/core/shared'
import { StudyParticipationWithAssignmentCompletionsDto } from '@stochus/studies/shared'

@Injectable({
  providedIn: 'root',
})
export class StudiesParticipationService {
  static readonly baseUrl = 'api/studies/participate'

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  getWithAssignmentCompletions(studyId: string) {
    return this.http
      .get(`${StudiesParticipationService.baseUrl}/${studyId}`)
      .pipe(
        map((res) =>
          plainToInstance(StudyParticipationWithAssignmentCompletionsDto, res),
        ),
      )
  }

  create(studyId: string) {
    return this.http
      .post(`${StudiesParticipationService.baseUrl}/${studyId}`, {})
      .pipe(
        map((res) =>
          plainToInstance(StudyParticipationWithAssignmentCompletionsDto, res),
        ),
      )
  }

  createAndOpen(studyId: string) {
    return this.create(studyId).pipe(
      switchMap(() =>
        fromPromise(this.router.navigate(['studies', 'participate', studyId])),
      ),
      map(() => undefined),
    )
  }
}
