import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs'
import { plainToInstance } from '@stochus/core/shared'
import { StudyParticipationDto } from '@stochus/studies/shared'

@Injectable({
  providedIn: 'root',
})
export class StudiesParticipationService {
  static readonly baseUrl = 'api/studies/participate'

  constructor(private readonly http: HttpClient) {}

  create(studyId: string) {
    return this.http
      .post(`${StudiesParticipationService.baseUrl}/${studyId}`, {})
      .pipe(map((res) => plainToInstance(StudyParticipationDto, res)))
  }
}
