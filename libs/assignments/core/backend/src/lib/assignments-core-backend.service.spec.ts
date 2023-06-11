import { Test } from '@nestjs/testing'
import { AssignmentsCoreBackendService } from './assignments-core-backend.service'

describe('AssignmentsCoreBackendService', () => {
  let service: AssignmentsCoreBackendService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AssignmentsCoreBackendService],
    }).compile()

    service = module.get(AssignmentsCoreBackendService)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })
})
