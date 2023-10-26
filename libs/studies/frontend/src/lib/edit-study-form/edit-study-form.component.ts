import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { Component, Input, OnDestroy } from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { heroBars2, heroTrash } from '@ng-icons/heroicons/outline'
import { validate } from 'class-validator'
import { FormModel } from 'ngx-mf'
import { Subscription, map, pairwise } from 'rxjs'
import { plainToInstance } from '@stochus/core/shared'
import { StudyCreateDto, StudyDto } from '@stochus/studies/shared'
import {
  AssignmentConfigFormHostComponent,
  AssignmentsService,
} from '@stochus/assignment/core/frontend'

type TaskFormControl = FormGroup<{
  assignmentId: FormControl<string | null>
  config?: FormModel<any>
  assignmentVersion?: FormControl<number | null>
}>

@Component({
  selector: 'stochus-edit-study-form',
  standalone: true,
  imports: [
    CommonModule,
    AssignmentConfigFormHostComponent,
    ReactiveFormsModule,
    NgIconComponent,
    CdkDrag,
    CdkDropList,
    CdkDragHandle,
  ],
  providers: [provideIcons({ heroTrash, heroBars2 })],
  templateUrl: './edit-study-form.component.html',
  styleUrls: ['./edit-study-form.component.css'],
})
export class EditStudyFormComponent implements OnDestroy {
  formGroup = this.generateFormGroup()
  assignments = this.assignmentsService.getAllAssignments()
  private tasksChangeSubscription?: Subscription

  @Input()
  set initialStudy(study: StudyDto | null) {
    this.formGroup = this.generateFormGroup(study)
  }

  constructor(
    private fb: FormBuilder,
    private assignmentsService: AssignmentsService,
  ) {}

  private toYyyyMmDd(date?: Date) {
    return date?.toISOString().split('T')[0]
  }

  private generateFormGroup(study?: StudyDto | null) {
    const result = this.fb.group(
      {
        name: [study?.name ?? null, [Validators.required]],
        description: [study?.description ?? null, [Validators.required]],
        startDate: [
          this.toYyyyMmDd(study?.startDate) ?? null,
          [Validators.required],
        ],
        endDate: [this.toYyyyMmDd(study?.endDate) ?? null],
        tasks: this.fb.array(
          study?.tasks.map((task): TaskFormControl => {
            const assignment = AssignmentsService.getByIdOrError(
              task.assignmentId,
            )
            return this.fb.group({
              assignmentId: [task.assignmentId],
              assignmentVersion: [task.assignmentVersion],
              config: assignment.generateConfigFormControl(
                this.fb,
                task.config,
              ),
            }) as unknown as TaskFormControl
          }) ?? [],
        ),
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

    this.tasksChangeSubscription?.unsubscribe()
    this.tasksChangeSubscription = result.controls.tasks.valueChanges
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

    return result
  }

  dropTask(event: CdkDragDrop<EditStudyFormComponent['taskControls']>) {
    moveItemInArray(this.taskControls, event.previousIndex, event.currentIndex)
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

  ngOnDestroy() {
    this.tasksChangeSubscription?.unsubscribe()
  }
}
