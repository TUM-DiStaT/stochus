import { Injectable } from '@angular/core'
import { GuessRandomNumberAssignmentForFrontend } from '@stochus/assignments/demos/guess-random-number/frontend'
import { AssignmentForFrontend } from '@stochus/assignments/model/frontend'

@Injectable({
  providedIn: 'root',
})
export class AssignmentsService {
  // Allow explicit any here to avoid subtyping issues due to
  // possible mixing of different assignment callbacks (just try removing it
  // and check out the error message). The service should still
  // expose the correct types to the outside. Type-safety should be "guaranteed"
  // at runtime using the id as a discriminator. Not nice, but it should work
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static readonly assignments: AssignmentForFrontend<any, any>[] = [
    GuessRandomNumberAssignmentForFrontend,
  ]

  static getById(assignmentId?: string | null) {
    return AssignmentsService.assignments.find(
      (assignment) => assignment.id === assignmentId,
    )
  }

  getAllAssignments() {
    return [...AssignmentsService.assignments]
  }
}
