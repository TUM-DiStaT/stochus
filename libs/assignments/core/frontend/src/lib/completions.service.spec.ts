import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { TestBed, inject } from '@angular/core/testing'
import 'reflect-metadata'
import { guessRandomNumberJustStarted } from '@stochus/assignment/core/shared'
import { GuessRandomNumberAssignment } from '@stochus/assignments/demos/guess-random-number/shared'
import { CompletionsService } from './completions.service'

describe('CompletionsService', () => {
  let service: CompletionsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    })
    service = TestBed.inject(CompletionsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should transform the completions correctly', inject(
    [CompletionsService, HttpTestingController],
    (service: CompletionsService, httpMock: HttpTestingController) => {
      service
        .getActive(GuessRandomNumberAssignment.id)
        .subscribe((completion) => {
          expect(completion).toBeDefined()
          expect(completion?.createdAt).toBeInstanceOf(Date)
          expect(completion?.config).toBeDefined()
          expect(completion?.completionData).toBeDefined()
        })

      const mockRequest = httpMock.expectOne(
        `${service.baseUrl}/${GuessRandomNumberAssignment.id}/active`,
      )
      expect(mockRequest.cancelled).toBeFalsy()
      expect(mockRequest.request.responseType).toEqual('json')
      mockRequest.flush(
        JSON.parse(JSON.stringify(guessRandomNumberJustStarted)),
      )

      httpMock.verify()
    },
  ))

  it('should transform a corrected completion correctly', inject(
    [CompletionsService, HttpTestingController],
    (service: CompletionsService, httpMock: HttpTestingController) => {
      service
        .createNewForAssignment(GuessRandomNumberAssignment.id)
        .subscribe((completion) => {
          expect(completion).toBeDefined()
          expect(completion?.createdAt).toBeInstanceOf(Date)
          expect(completion?.config).toBeDefined()
          expect(completion?.completionData).toBeDefined()
        })

      const mockRequest = httpMock.expectOne(
        `${service.baseUrl}/${GuessRandomNumberAssignment.id}`,
      )
      expect(mockRequest.cancelled).toBeFalsy()
      expect(mockRequest.request.responseType).toEqual('json')
      mockRequest.flush(
        JSON.parse(JSON.stringify(guessRandomNumberJustStarted)),
      )

      httpMock.verify()
    },
  ))
})
