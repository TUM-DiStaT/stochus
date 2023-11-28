import { TestBed } from '@angular/core/testing'
import { InteractionLogsService } from './interaction-logs.service'

describe('InteractionLogsServiceService', () => {
  let service: InteractionLogsService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(InteractionLogsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
