import { CommonModule } from '@angular/common'
import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { FormModel } from 'ngx-mf'
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
  @Input()
  assignmentId!: string

  @Input()
  configFormControl!: FormModel<any>

  @ViewChild(DynamicContentDirective, { static: true })
  host!: DynamicContentDirective

  ngOnInit() {
    const assignment = AssignmentsService.getByIdOrError(this.assignmentId)
    const viewContainerRef = this.host.viewContainerRef
    viewContainerRef.clear()
    const componentRef = viewContainerRef.createComponent(
      assignment.configurationInputFormComponent,
    )

    componentRef.instance.formControl = this
      .configFormControl as unknown as typeof componentRef.instance.formControl
  }
}
