import { CommonModule } from '@angular/common'
import { Component, HostBinding } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import {
  heroEllipsisVertical,
  heroForward,
  heroPlay,
} from '@ng-icons/heroicons/outline'
import { firstValueFrom, map, shareReplay } from 'rxjs'
import { ButtonComponent } from '@stochus/daisy-ui'
import { AssignmentsService } from '../assignments.service'
import { CompletionsService } from '../completions.service'

@Component({
  selector: 'stochus-assignments-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NgIconComponent, RouterLink],
  templateUrl: './assignments-list.component.html',
  providers: [provideIcons({ heroForward, heroPlay, heroEllipsisVertical })],
})
export class AssignmentsListComponent {
  activeCompletions$ = this.completionsService.getActive().pipe(
    map((completions) =>
      completions.reduce(
        (acc, { assignmentId, id }) => ({
          ...acc,
          [assignmentId]: id,
        }),
        {} as Record<string, string>,
      ),
    ),
    shareReplay(),
  )

  constructor(
    private readonly assignmentsService: AssignmentsService,
    private readonly completionsService: CompletionsService,
    private readonly router: Router,
  ) {}

  @HostBinding('class')
  className = 'flex items-stretch justify-center'

  get assignments() {
    return this.assignmentsService.getAllAssignments()
  }

  async startAssignment(assignmentId: string, event: MouseEvent) {
    const currCompletions = await firstValueFrom(this.activeCompletions$)
    if (!currCompletions[assignmentId]) {
      event.stopPropagation()
      event.preventDefault()

      this.completionsService.createNewForAssignment(assignmentId).subscribe({
        next: (completion) => {
          this.router.navigate(['complete', completion?.id])
        },
      })
    }
  }
}
