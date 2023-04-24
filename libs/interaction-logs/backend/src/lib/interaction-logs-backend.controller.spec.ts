import { Test } from '@nestjs/testing'
import { InteractionLogsController } from './interaction-logs.controller'
import { InteractionLogsService } from './interaction-logs.service'

describe('InteractionLogsBackendController', () => {
  let controller: InteractionLogsController

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [InteractionLogsService],
      controllers: [InteractionLogsController],
    }).compile()

    controller = module.get(InteractionLogsController)
  })

  it('should be defined', () => {
    expect(controller).toBeTruthy()
  })
})
