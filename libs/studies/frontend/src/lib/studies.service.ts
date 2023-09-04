import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs'
import { plainToInstance } from '@stochus/core/shared'
import {
  StudyCreateDto,
  StudyDto,
  StudyUpdateDto,
} from '@stochus/studies/shared'

@Injectable({
  providedIn: 'root',
})
export class StudiesService {
  readonly baseUrl = '/api/studies/manage'

  constructor(private readonly http: HttpClient) {}

  getAllOwnedByUser() {
    return this.http
      .get<unknown[]>(`${this.baseUrl}`)
      .pipe(map((studies) => plainToInstance(StudyDto, studies)))
  }

  create(dto: StudyCreateDto) {
    return this.http
      .post(`${this.baseUrl}`, dto)
      .pipe(map((studies) => plainToInstance(StudyDto, studies)))
  }

  delete(study: StudyDto) {
    return this.http.delete<void>(`${this.baseUrl}/${study.id}`)
  }

  getById(studyId: string) {
    return this.http
      .get(`${this.baseUrl}/${studyId}`)
      .pipe(map((studies) => plainToInstance(StudyDto, studies)))
  }

  update(id: string, dto: StudyUpdateDto) {
    return this.http
      .put(`${this.baseUrl}/${id}`, dto)
      .pipe(map((studies) => plainToInstance(StudyDto, studies)))
  }
}
