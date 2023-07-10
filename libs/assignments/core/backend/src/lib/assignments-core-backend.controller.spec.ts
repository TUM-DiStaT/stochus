import { Test } from '@nestjs/testing'
import { AssignmentsCoreBackendController } from './assignments-core-backend.controller'
import { AssignmentsCoreBackendService } from './assignments-core-backend.service'

describe('AssignmentsCoreBackendController', () => {
  let controller: AssignmentsCoreBackendController

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AssignmentsCoreBackendService],
      controllers: [AssignmentsCoreBackendController],
    }).compile()

    controller = module.get(AssignmentsCoreBackendController)
  })

  it('should be defined', () => {
    expect(controller).toBeTruthy()
  })
})
