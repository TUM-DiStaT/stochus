import { CommonModule } from '@angular/common'
import { Component, ViewChild } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { plainToInstance } from '@stochus/core/shared'
import { StudyCreateDto } from '@stochus/studies/shared'
import { ToastService } from '@stochus/daisy-ui'
import { EditStudyFormComponent } from '../edit-study-form/edit-study-form.component'
import { StudiesService } from '../studies.service'

@Component({
  selector: 'stochus-create-study',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditStudyFormComponent],
  templateUrl: './create-study.component.html',
})
export class CreateStudyComponent {
  @ViewChild('studyEditForm')
  studyEditForm!: EditStudyFormComponent

  constructor(
    private studiesService: StudiesService,
    private toastService: ToastService,
    private router: Router,
  ) {}

  submit() {
    const formGroup = this.studyEditForm.formGroup
    if (formGroup.valid) {
      this.studiesService
        .create(plainToInstance(StudyCreateDto, formGroup.value))
        .subscribe({
          next: () => {
            this.toastService.success('Studie wurde erfolgreich erstellt')
            this.router.navigate(['studiesManagement'])
          },
          error: (e) => {
            console.error(e)
            this.toastService.error(
              'Beim Speichern der Studie ist ein Fehler aufgetreten',
            )
          },
        })
    }
  }
}
