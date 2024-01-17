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

  it('sanity check: should have no assignment ID collisions', () => {
    const ids = AssignmentsCoreBackendService.getAllAssignments().map(
      (a) => a.id,
    )
    const set = new Set(ids)
    expect(set.size).toBe(ids.length)
  })
})
