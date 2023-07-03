import { Injectable } from '@nestjs/common'
import { GuessRandomNumberAssignment } from '@stochus/assignments/demos/guess-random-number/shared'
import { BaseAssignment } from '@stochus/assignments/model/shared'

@Injectable()
export class AssignmentsCoreBackendService {
  // Allow explicit any here to avoid subtyping issues due to
  // possible mixing of different assignment callbacks (just try removing it
  // and check out the error message). The service should still
  // expose the correct types to the outside. Type-safety should be "guaranteed"
  // at runtime using the id as a discriminator. Not nice, but it should work
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static readonly assignments: BaseAssignment<any, any>[] = [
    GuessRandomNumberAssignment,
  ]

  static getAllAssignments() {
    return [...AssignmentsCoreBackendService.assignments]
  }

  static getById(assignmentId: string) {
    return this.getAllAssignments().find(
      (assignment) => assignment.id === assignmentId,
    )
  }
}
