import { CommonModule } from '@angular/common'
import { Component, OnDestroy } from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { heroTrash } from '@ng-icons/heroicons/outline'
import { FormModel } from 'ngx-mf'
import { map, pairwise } from 'rxjs'
import {
  AssignmentConfigFormHostComponent,
  AssignmentsService,
} from '@stochus/assignment/core/frontend'

type TaskFormControl = FormGroup<{
  assignmentId: FormControl<string | null>
  config?: FormModel<any>
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
  formGroup = this.fb.group({
    name: [null as string | null, [Validators.required]],
    description: [null as string | null, [Validators.required]],
    tasks: this.fb.array([] as TaskFormControl[]),
  })
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

        if (assignmentId) {
          const assignment = AssignmentsService.getByIdOrError(assignmentId)
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
}
