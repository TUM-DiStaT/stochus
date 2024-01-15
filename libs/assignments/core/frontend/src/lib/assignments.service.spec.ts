import { TestBed } from '@angular/core/testing'
import { AssignmentsService } from './assignments.service'

describe('AssignmentsService', () => {
  let service: AssignmentsService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(AssignmentsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('sanity check: should have no assignment ID collisions', () => {
    const ids = service.getAllAssignments().map((a) => a.id)
    const set = new Set(ids)
    expect(set.size).toBe(ids.length)
  })
})
