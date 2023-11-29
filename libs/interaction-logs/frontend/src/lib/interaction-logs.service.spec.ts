import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import 'reflect-metadata'
import { InteractionLogsService } from './interaction-logs.service'

describe('InteractionLogsServiceService', () => {
  let service: InteractionLogsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    })
    service = TestBed.inject(InteractionLogsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
