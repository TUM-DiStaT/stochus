import { CommonModule } from '@angular/common'
import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { validateSync } from 'class-validator'
import { FormModel } from 'ngx-mf'
import { plainToInstance } from '@stochus/core/shared'
import { DynamicContentDirective } from '@stochus/core/frontend'
import { AssignmentsService } from '../assignments.service'

@Component({
  selector: 'stochus-assignment-config-form-host',
  standalone: true,
  imports: [CommonModule, DynamicContentDirective],
  templateUrl: './assignment-config-form-host.component.html',
  styles: [':host { display: contents;}'],
})
export class AssignmentConfigFormHostComponent implements OnInit {
  private _assignmentId!: string

  get assignmentId(): string {
    return this._assignmentId
  }

  @Input()
  set assignmentId(value: string) {
    this._assignmentId = value
    this.updateViewContainer()
  }

  // Correct typing is guaranteed by input validation later on.
  // It would be too complicated to deal with all the generics now
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _configFormControl!: FormModel<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get configFormControl(): FormModel<any> {
    return this._configFormControl
  }
  @Input()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set configFormControl(value: FormModel<any>) {
    this._configFormControl = value
    this.updateViewContainer()
  }

  @ViewChild(DynamicContentDirective, { static: true })
  host!: DynamicContentDirective

  updateViewContainer() {
    const assignment = AssignmentsService.getByIdOrError(this._assignmentId)

    const config = this._configFormControl?.value
    const instance = plainToInstance(assignment.configurationClass, config)
    const errors = validateSync(instance)
    if (errors.length > 0) {
      return
    }

    const viewContainerRef = this.host.viewContainerRef
    viewContainerRef.clear()
    const componentRef = viewContainerRef.createComponent(
      assignment.configurationInputFormComponent,
    )

    componentRef.instance.formControl = this
      ._configFormControl as unknown as typeof componentRef.instance.formControl
  }

  ngOnInit() {
    this.updateViewContainer()
  }
}
