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
import {
  heroBars2,
  heroInformationCircle,
  heroTrash,
} from '@ng-icons/heroicons/outline'
import { validate } from 'class-validator'
import { FormModel } from 'ngx-mf'
import { MonacoEditorModule } from 'ngx-monaco-editor-v2'
import { Observable, Subscription, concat, map, of, pairwise } from 'rxjs'
import { plainToInstance } from '@stochus/core/shared'
import {
  StudyCreateDto,
  StudyDto,
  StudyFeedbackDto,
} from '@stochus/studies/shared'
import {
  AssignmentConfigFormHostComponent,
  AssignmentsService,
} from '@stochus/assignment/core/frontend'
import { KeycloakAdminService } from '@stochus/auth/frontend'
import { PreventH1Directive } from '@stochus/core/frontend'
import { StudyFeedbackComponent } from '../study-feedback/study-feedback.component'

type TaskFormControl = FormGroup<{
  assignmentId: FormControl<string | null>
  // Correct typing is guaranteed by input validation later on.
  // It would be too complicated to deal with all the generics now
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    MonacoEditorModule,
    PreventH1Directive,
    StudyFeedbackComponent,
  ],
  providers: [provideIcons({ heroTrash, heroBars2, heroInformationCircle })],
  templateUrl: './edit-study-form.component.html',
  styleUrls: ['./edit-study-form.component.css'],
})
export class EditStudyFormComponent implements OnDestroy {
  formGroup = this.generateFormGroup()
  assignments = this.assignmentsService.getAllAssignments()
  private tasksChangeSubscription?: Subscription
  groups$ = this.keycloakAdminService.getGroups()

  readonly monacoOptions = {
    theme: 'vs-light',
    language: 'markdown',
    minimap: { enabled: false },
  }

  studyForFeedback$: Observable<StudyFeedbackDto> = this.getStudyForFeedback()

  @Input()
  set initialStudy(study: StudyDto | null) {
    this.formGroup = this.generateFormGroup(study)
    this.studyForFeedback$ = this.getStudyForFeedback()
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly assignmentsService: AssignmentsService,
    private readonly keycloakAdminService: KeycloakAdminService,
  ) {}

  private toYyyyMmDd(date?: Date) {
    return date?.toISOString().split('T')[0]
  }

  private generateFormGroup(study?: StudyDto | null) {
    const result = this.fb.group(
      {
        name: [study?.name ?? null, [Validators.required]],
        description: [study?.description ?? null, [Validators.required]],
        messageAfterFeedback: [
          study?.messageAfterFeedback ?? null,
          [Validators.required],
        ],
        startDate: [
          this.toYyyyMmDd(study?.startDate) ?? null,
          [Validators.required],
        ],
        endDate: [this.toYyyyMmDd(study?.endDate) ?? null],
        participantsGroupId: [
          study?.participantsGroupId ?? null,
          [Validators.required],
        ],
        randomizeTaskOrder: [study?.randomizeTaskOrder ?? false],
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
        // finds all assignments that changed compared to last time
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

  getStudyForFeedback() {
    return concat(of(this.formGroup.value), this.formGroup.valueChanges).pipe(
      map(() => plainToInstance(StudyFeedbackDto, this.formGroup.value)),
    )
  }
}
