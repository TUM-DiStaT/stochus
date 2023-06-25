import { Injectable } from '@angular/core'
import { AssignmentForFrontend } from '@stochus/assignments/model/frontend'
import { BaseCompletionData } from '@stochus/assignments/model/shared'

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
  private static assignments: AssignmentForFrontend<any, any>[] = []

  public static register<Config, Completion extends BaseCompletionData>(
    assignment: AssignmentForFrontend<Config, Completion>,
  ) {
    this.assignments.push(assignment)
  }

  getAllAssignments() {
    return [...AssignmentsService.assignments]
  }
}
