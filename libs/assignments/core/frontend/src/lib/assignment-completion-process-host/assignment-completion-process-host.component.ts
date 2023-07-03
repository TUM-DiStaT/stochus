import { CommonModule } from '@angular/common'
import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { map } from 'rxjs'
import { DynamicContentDirective } from '@stochus/core/frontend'
import { AssignmentsService } from '../assignments.service'

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
  @ViewChild(DynamicContentDirective, { static: true })
  host!: DynamicContentDirective

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.assignment$.subscribe((assignment) => {
      const viewContainerRef = this.host.viewContainerRef
      viewContainerRef.clear()
      const componentRef = viewContainerRef.createComponent(
        assignment.completionProcessComponent,
      )
      // componentRef.instance.config = assignment.conf
      componentRef.instance.completionData =
        assignment.getInitialCompletionData()
    })
  }
}
