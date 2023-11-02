import { CommonModule } from '@angular/common'
import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
  EMPTY,
  catchError,
  combineLatest,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs'
import { BaseCompletionData } from '@stochus/assignments/model/shared'
import { DynamicContentDirective } from '@stochus/core/frontend'
import { AssignmentsService } from '../assignments.service'
import { CompletionsService } from '../completions.service'

@Component({
  selector: 'stochus-assignment-completion-process-host',
  standalone: true,
  imports: [CommonModule, DynamicContentDirective],
  templateUrl: './assignment-completion-process-host.component.html',
})
export class AssignmentCompletionProcessHostComponent implements OnInit {
  @Input()
  assignment$ = this.activatedRoute.paramMap.pipe(
    map((v) =>
      AssignmentsService.getByIdOrError(
        v.get('assignmentId'),
        'This should be impossible as per the canActivate check!',
      ),
    ),
  )

  @Input()
  completion$ = this.assignment$.pipe(
    switchMap((assignment) => {
      return this.completionsService.getActive(assignment.id)
    }),
    filter(Boolean),
    catchError(() => {
      this.router.navigate(['assignments'])
      return EMPTY
    }),
  )

  @ViewChild(DynamicContentDirective, { static: true })
  host!: DynamicContentDirective

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly completionsService: CompletionsService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    combineLatest([this.assignment$, this.completion$]).subscribe(
      ([assignment, completion]) => {
        // Render component into host
        const viewContainerRef = this.host.viewContainerRef
        viewContainerRef.clear()
        const componentRef = viewContainerRef.createComponent(
          assignment.completionProcessComponent,
        )

        // Set component props, subscribe to event emitters
        componentRef.instance.config = completion.config
        componentRef.instance.completionData = completion.completionData
        componentRef.instance.updateCompletionData
          .pipe(
            switchMap((completionData: Partial<BaseCompletionData>) => {
              return this.completionsService.updateCompletionData(
                completion.id,
                completionData,
              )
            }),
            tap((completion) => {
              if (
                (completion.completionData as BaseCompletionData).progress === 1
              ) {
                this.onCompleteAssignment(completion.id)
              }
            }),
          )
          .subscribe({
            next: (updatedCompletionData) => {
              componentRef.setInput(
                'completionData',
                updatedCompletionData.completionData,
              )
            },
          })
      },
    )
  }

  onCompleteAssignment(completionId: string) {
    this.router.navigate(['completions', completionId, 'feedback'])
  }
}
