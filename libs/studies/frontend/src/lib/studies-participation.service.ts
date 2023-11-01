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

  getByStudyId(studyId: string) {
    return this.http
      .get(`${StudiesParticipationService.baseUrl}/${studyId}`)
      .pipe(map((res) => plainToInstance(StudyParticipationDto, res)))
  }

  create(studyId: string) {
    return this.http
      .post(`${StudiesParticipationService.baseUrl}/${studyId}`, {})
      .pipe(map((res) => plainToInstance(StudyParticipationDto, res)))
  }
}
