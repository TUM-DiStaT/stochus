import { AsyncPipe } from '@angular/common'
import { Component, HostBinding, Input } from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown'
import { EMPTY, switchMap } from 'rxjs'
import { PreventH1Directive } from '@stochus/core/frontend'
import { StudiesService } from '@stochus/studies/frontend-static'
import { ToastService } from '@stochus/daisy-ui'

@Component({
  standalone: true,
  selector: 'stochus-study-feedback',
  templateUrl: './study-feedback.component.html',
  imports: [RouterLink, MarkdownComponent, AsyncPipe, PreventH1Directive],
  providers: [provideMarkdown()],
})
export class StudyFeedbackComponent {
  @HostBinding('class')
  readonly className = 'grid place-content-center flex-1'

  @Input()
  studyForFeedback$ = this.activatedRoute.paramMap.pipe(
    switchMap((map) => {
      const studyId = map.get('studyId')
      if (studyId) {
        return this.studiesService.getByIdForFeedback(studyId)
      } else {
        this.toastService.error('Konnte Studie nicht finden')
        this.router.navigate([''])
        return EMPTY
      }
    }),
  )

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly toastService: ToastService,
    private readonly studiesService: StudiesService,
  ) {}
}
