import { CommonModule } from '@angular/common'
import { Component, OnDestroy } from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Router } from '@angular/router'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { heroTrash } from '@ng-icons/heroicons/outline'
import { validate } from 'class-validator'
import { FormModel } from 'ngx-mf'
import { map, pairwise } from 'rxjs'
import { plainToInstance } from '@stochus/core/shared'
import { StudyCreateDto } from '@stochus/studies/shared'
import {
  AssignmentConfigFormHostComponent,
  AssignmentsService,
} from '@stochus/assignment/core/frontend'
import { ToastService } from '@stochus/daisy-ui'
import { StudiesService } from '../studies.service'

type TaskFormControl = FormGroup<{
  assignmentId: FormControl<string | null>
  config?: FormModel<any>
  assignmentVersion?: FormControl<number | null>
}>

@Component({
  selector: 'stochus-create-study',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIconComponent,
    AssignmentConfigFormHostComponent,
  ],
  providers: [provideIcons({ heroTrash })],
  templateUrl: './create-study.component.html',
})
export class CreateStudyComponent implements OnDestroy {
  formGroup = this.fb.group(
    {
      name: [null as string | null, [Validators.required]],
      description: [null as string | null, [Validators.required]],
      startDate: [null as Date | null, [Validators.required]],
      endDate: [null as Date | null],
      tasks: this.fb.array([] as TaskFormControl[]),
    },
    {
      asyncValidators: [
        async (control) => {
          const parsed = plainToInstance(StudyCreateDto, control.value)
          const res = await validate(parsed)
          return res.length > 0
            ? res.reduce(
                (errs, currErr) => ({
                  ...errs,
                  [currErr.property]: currErr.constraints,
                }),
                {} as Record<string, unknown>,
              )
            : null
        },
      ],
    },
  )
  assignments = this.assignmentsService.getAllAssignments()

  private tasksChangeSubscription = this.formGroup.controls.tasks.valueChanges
    .pipe(
      pairwise(),
      map(([prev, curr]) =>
        curr.flatMap(({ assignmentId }, index) =>
          prev[index]?.assignmentId === assignmentId
            ? []
            : [{ index, assignmentId }],
        ),
      ),
    )
    .subscribe((changed) => {
      changed.forEach(({ assignmentId, index }) => {
        const taskControl = this.formGroup.controls.tasks.at(index)
        taskControl.removeControl('config')
        taskControl.removeControl('assignmentVersion')

        if (assignmentId) {
          const assignment = AssignmentsService.getByIdOrError(assignmentId)
          taskControl.addControl(
            'assignmentVersion',
            new FormControl(assignment.version),
          )
          taskControl.addControl(
            'config',
            assignment.generateConfigFormControl(
              this.fb,
              assignment.getRandomConfig(),
            ),
          )
        }
      })
    })

  constructor(
    private fb: FormBuilder,
    private assignmentsService: AssignmentsService,
    private studiesService: StudiesService,
    private toastService: ToastService,
    private router: Router,
  ) {}

  ngOnDestroy() {
    this.tasksChangeSubscription.unsubscribe()
  }

  addTask() {
    const taskFormGroup = this.fb.group({
      assignmentId: [null as null | string, [Validators.required]],
    })

    this.formGroup.controls.tasks.push(taskFormGroup)
  }

  deleteTask(index: number) {
    this.formGroup.controls.tasks.removeAt(index)
  }

  get taskControls() {
    return this.formGroup.controls.tasks.controls as TaskFormControl[]
  }

  submit() {
    if (this.formGroup.valid) {
      this.studiesService
        .create(plainToInstance(StudyCreateDto, this.formGroup.value))
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
