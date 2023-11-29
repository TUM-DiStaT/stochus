import { CommonModule } from '@angular/common'
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
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
import { AssignmentCompletionDto } from '@stochus/assignment/core/shared'
import { BaseCompletionData } from '@stochus/assignments/model/shared'
import { DynamicContentDirective } from '@stochus/core/frontend'
import { InteractionLogsService } from '@stochus/interaction-logs/frontend'
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

  @Output()
  completeAssignment = new EventEmitter<AssignmentCompletionDto>()

  @ViewChild(DynamicContentDirective, { static: true })
  host!: DynamicContentDirective

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly completionsService: CompletionsService,
    private readonly router: Router,
    private readonly interactionLogsService: InteractionLogsService,
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
                this.onCompleteAssignment(completion.id, completion)
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

        // Send logs from component via logging service if student
        // is participating in study
        if (completion.isForStudy) {
          componentRef.instance.createInteractionLog
            .pipe(
              switchMap((log) =>
                this.interactionLogsService
                  .log({
                    assignmentCompletionId: completion.id,
                    payload: log,
                  })
                  .pipe(
                    catchError((e) => {
                      console.error(e)
                      return EMPTY
                    }),
                  ),
              ),
            )
            .subscribe()
        }
      },
    )
  }

  onCompleteAssignment(
    completionId: string,
    completion: AssignmentCompletionDto,
  ) {
    if (this.completeAssignment.observed) {
      this.completeAssignment.next(completion)
    } else {
      this.router.navigate(['completions', completionId, 'feedback'])
    }
  }
}
