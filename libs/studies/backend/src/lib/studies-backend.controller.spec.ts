import { Test } from '@nestjs/testing'
import { StudiesBackendController } from './studies-backend.controller'
import { StudiesBackendService } from './studies-backend.service'

describe('StudiesBackendController', () => {
  let controller: StudiesBackendController

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [StudiesBackendService],
      controllers: [StudiesBackendController],
    }).compile()

    controller = module.get(StudiesBackendController)
  })

  it('should be defined', () => {
    expect(controller).toBeTruthy()
  })
})
