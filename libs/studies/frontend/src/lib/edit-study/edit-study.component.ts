import { CommonModule } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { Component, ViewChild } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { EMPTY, catchError, switchMap } from 'rxjs'
import { ToastService } from '@stochus/daisy-ui'
import { EditStudyFormComponent } from '../edit-study-form/edit-study-form.component'
import { StudiesService } from '../studies.service'

@Component({
  selector: 'stochus-edit-study',
  standalone: true,
  imports: [
    CommonModule,
    EditStudyFormComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-study.component.html',
})
export class EditStudyComponent {
  @ViewChild('studyEditForm')
  studyEditForm?: EditStudyFormComponent

  study$ = this.activatedRoute.paramMap.pipe(
    switchMap((map) => {
      const studyId = map.get('studyId')
      if (!studyId) {
        this.toastService.error(
          'Es konnte keine Studie aus der URL extrahiert werden',
        )
        return EMPTY
      }
      return this.studiesService.getById(studyId)
    }),
    catchError((e: HttpErrorResponse) => {
      const studyId = e.url?.split('/').at(-1)
      if (e.status === 404) {
        this.toastService.error(
          `Es konnte keine Studie mit ID ${studyId} gefunden werden`,
        )
      } else if (e.status === 403) {
        this.toastService.error(
          `Die Studie mit der ID ${studyId} gehört einer anderen Person`,
        )
      } else {
        console.error(e)
        this.toastService.error(
          'Beim Laden der Studie ist ein Fehler aufgetreten',
        )
      }

      this.router.navigate(['studiesManagement'])
      return EMPTY
    }),
  )

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private studiesService: StudiesService,
    private router: Router,
  ) {}

  submit() {
    //
  }
}
