import { CommonModule } from '@angular/common'
import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { EMPTY, catchError, combineLatest, filter, map, switchMap } from 'rxjs'
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
  assignment$ = this.activatedRoute.paramMap.pipe(
    map((v) => {
      const assignment = AssignmentsService.getById(v.get('assignmentId'))
      if (!assignment) {
        throw new Error(
          'This should be impossible as per the canActivate check!',
        )
      }
      return assignment
    }),
  )

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
        const viewContainerRef = this.host.viewContainerRef
        viewContainerRef.clear()
        const componentRef = viewContainerRef.createComponent(
          assignment.completionProcessComponent,
        )
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
}
