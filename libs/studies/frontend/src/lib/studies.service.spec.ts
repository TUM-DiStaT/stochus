import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing'
import { TestBed, inject } from '@angular/core/testing'
import { validateOrReject } from 'class-validator'
import 'reflect-metadata'
import { firstValueFrom } from 'rxjs'
import {
  StudyDto,
  validStudyCreateDto,
  validStudyDto,
} from '@stochus/studies/shared'
import { StudiesService } from './studies.service'

const verifySingleJsonRequest = ({
  mockRequest,
  data,
  httpMock,
}: {
  mockRequest: TestRequest
  data: object
  httpMock: HttpTestingController
}) => {
  expect(mockRequest.cancelled).toBeFalsy()
  expect(mockRequest.request.responseType).toEqual('json')

  // Ensures same structure as returned by fetch().json, which e.g. doesn't parse dates
  const fromJSON = JSON.parse(JSON.stringify(data))
  mockRequest.flush(fromJSON)

  httpMock.verify()
}

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

  it("should correctly fetch and transform the user's studies", inject(
    [StudiesService, HttpTestingController],
    async (service: StudiesService, httpMock: HttpTestingController) => {
      const responsePromise = firstValueFrom(service.getAllOwnedByUser())

      verifySingleJsonRequest({
        httpMock,
        mockRequest: httpMock.expectOne(`${service.baseUrl}/manage`),
        data: [validStudyDto],
      })

      const response = await responsePromise
      expect(response).toHaveLength(1)
      expect(response[0]).toBeInstanceOf(StudyDto)
      await expect(validateOrReject(response[0])).resolves.toBeUndefined()
    },
  ))

  it('should correctly map the created study', inject(
    [StudiesService, HttpTestingController],
    async (service: StudiesService, httpMock: HttpTestingController) => {
      const createdStudyPromise = firstValueFrom(
        service.create(validStudyCreateDto),
      )

      verifySingleJsonRequest({
        httpMock,
        mockRequest: httpMock.expectOne(`${service.baseUrl}/manage`),
        data: validStudyDto,
      })

      const created = await createdStudyPromise

      expect(created).toBeInstanceOf(StudyDto)
      await expect(validateOrReject(created)).resolves.toBeUndefined()
    },
  ))

  it('should correctly map the study gotten by ID', inject(
    [StudiesService, HttpTestingController],
    async (service: StudiesService, httpMock: HttpTestingController) => {
      const createdStudyPromise = firstValueFrom(
        service.getById(validStudyDto.id),
      )

      verifySingleJsonRequest({
        httpMock,
        mockRequest: httpMock.expectOne(
          `${service.baseUrl}/manage/${validStudyDto.id}`,
        ),
        data: validStudyDto,
      })

      const created = await createdStudyPromise

      expect(created).toBeInstanceOf(StudyDto)
      await expect(validateOrReject(created)).resolves.toBeUndefined()
    },
  ))

  it('should correctly map the updated study', inject(
    [StudiesService, HttpTestingController],
    async (service: StudiesService, httpMock: HttpTestingController) => {
      const createdStudyPromise = firstValueFrom(
        service.update(validStudyDto.id, validStudyDto),
      )

      verifySingleJsonRequest({
        httpMock,
        mockRequest: httpMock.expectOne(
          `${service.baseUrl}/manage/${validStudyDto.id}`,
        ),
        data: validStudyDto,
      })

      const created = await createdStudyPromise

      expect(created).toBeInstanceOf(StudyDto)
      await expect(validateOrReject(created)).resolves.toBeUndefined()
    },
  ))
})
