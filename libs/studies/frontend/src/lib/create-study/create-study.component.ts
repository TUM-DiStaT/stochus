import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { heroTrash } from '@ng-icons/heroicons/outline'
import { GuessRandomNumberAssignment } from '@stochus/assignments/demos/guess-random-number/shared'
import { AssignmentsService } from '@stochus/assignment/core/frontend'

type TaskFormControl = FormGroup<{
  assignmentId: FormControl<string | null>
}>

@Component({
  selector: 'stochus-create-study',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  providers: [provideIcons({ heroTrash })],
  templateUrl: './create-study.component.html',
})
export class CreateStudyComponent {
  formGroup = new FormGroup({
    name: new FormControl<string | null>(null, {
      validators: [],
    }),
    description: new FormControl<string | null>(null),
    tasks: new FormArray<TaskFormControl>([
      this.fb.group({
        assignmentId: [GuessRandomNumberAssignment.id, Validators.required],
      }),
      this.fb.group({
        assignmentId: [GuessRandomNumberAssignment.id, Validators.required],
      }),
    ]),
  })
  assignments = this.assignmentsService.getAllAssignments()

  constructor(
    private fb: FormBuilder,
    private assignmentsService: AssignmentsService,
  ) {}

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
