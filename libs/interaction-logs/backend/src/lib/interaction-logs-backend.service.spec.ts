import { Test } from '@nestjs/testing'
import { InteractionLogsService } from './interaction-logs.service'

describe('InteractionLogsBackendService', () => {
  let service: InteractionLogsService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [InteractionLogsService],
    }).compile()

    service = module.get(InteractionLogsService)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })
})
