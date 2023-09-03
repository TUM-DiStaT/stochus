import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { TestBed, inject } from '@angular/core/testing'
import { firstValueFrom } from 'rxjs'
import { validStudyDto } from '@stochus/studies/shared'
import { StudiesService } from './studies.service'

describe('StudiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    })
  })

  it('should be created', inject(
    [StudiesService],
    (service: StudiesService) => {
      expect(service).toBeTruthy()
    },
  ))

  it('should correctly fetch and transform the users studies', inject(
    [StudiesService, HttpTestingController],
    async (service: StudiesService, httpMock: HttpTestingController) => {
      const responsePromise = firstValueFrom(service.getAllOwnedByUser())

      const mockRequest = httpMock.expectOne(`${service.baseUrl}`)
      expect(mockRequest.cancelled).toBeFalsy()
      expect(mockRequest.request.responseType).toEqual('json')
      mockRequest.flush(JSON.parse(JSON.stringify([validStudyDto])))

      httpMock.verify()

      const response = await responsePromise
      expect(response).toHaveLength(1)
      expect(response[0]).toHaveProperty('startDate', expect.any(Date))
    },
  ))
})
