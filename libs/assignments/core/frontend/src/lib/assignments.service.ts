import { Injectable } from '@angular/core'
import { GuessRandomNumberAssignmentForFrontend } from '@stochus/assignments/demos/guess-random-number/frontend'
import { ExtractFromHistogramAssignmentForFrontend } from '@stochus/assignments/extract-from-assignment/frontend'
import { IdentifySharedCharacteristicsAssignmentForFrontend } from '@stochus/assignments/identify-shared-characteristics/frontend'
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GuessRandomNumberAssignmentForFrontend as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ExtractFromHistogramAssignmentForFrontend as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IdentifySharedCharacteristicsAssignmentForFrontend as any,
  ]

  static getById(assignmentId?: string | null) {
    return AssignmentsService.assignments.find(
      (assignment) => assignment.id === assignmentId,
    )
  }

  static getByIdOrError(assignmentId?: string | null, message?: string) {
    const result = AssignmentsService.getById(assignmentId)
    const errorMessage =
      message ?? `Couldn't find assignment with ID ${assignmentId}`
    if (!result) {
      throw new Error(errorMessage)
    }
    return result
  }

  getAllAssignments() {
    return [...AssignmentsService.assignments]
  }
}
