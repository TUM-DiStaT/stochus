import { CommonModule } from '@angular/common'
import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { filter, map, of, switchMap } from 'rxjs'
import { AssignmentCompletionDto } from '@stochus/assignment/core/shared'
import { DynamicContentDirective } from '@stochus/core/frontend'
import { AssignmentsService } from '../assignments.service'
import { CompletionsService } from '../completions.service'

@Component({
  selector: 'stochus-assignment-feedback-host',
  standalone: true,
  imports: [CommonModule, DynamicContentDirective],
  templateUrl: './assignment-feedback-host.component.html',
})
export class AssignmentFeedbackHostComponent implements OnInit {
  completion$ = this.activatedRoute.paramMap.pipe(
    switchMap((paramMap) => {
      const completionId = paramMap.get('completionId')

      if (!completionId) {
        return of(undefined)
      }

      return this.completionsService.getById(completionId)
    }),
    filter((completion): completion is AssignmentCompletionDto => {
      if (!completion) {
        throw new Error(
          'This should be impossible as per the canActivate check!',
        )
      }

      return true
    }),
    map(
      (completion) =>
        [
          completion,
          AssignmentsService.getByIdOrError(completion.assignmentId),
        ] as const,
    ),
  )

  @ViewChild(DynamicContentDirective, { static: true })
  host!: DynamicContentDirective

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly completionsService: CompletionsService,
  ) {}

  ngOnInit() {
    this.completion$.subscribe(([completion, assignment]) => {
      // Render component into host
      const viewContainerRef = this.host.viewContainerRef
      viewContainerRef.clear()
      const componentRef = viewContainerRef.createComponent(
        assignment.feedbackComponent,
      )

      // set component props
      componentRef.instance.config = completion.config
      componentRef.instance.completionData = completion.completionData
    })
  }
}
