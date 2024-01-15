import { CommonModule } from '@angular/common'
import { Component, EventEmitter } from '@angular/core'
import {
  ExtractFromHistogramAssignmentCompletionData,
  ExtractFromHistogramAssignmentConfiguration,
} from '@stochus/assignments/extract-from-histogram-assignment/shared'
import { AssignmentProcessProps } from '@stochus/assignments/model/frontend'

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './extract-from-histogram-assignment-process.component.html',
  styles: ``,
})
export class ExtractFromHistogramAssignmentProcessComponent
  implements
    AssignmentProcessProps<
      ExtractFromHistogramAssignmentConfiguration,
      ExtractFromHistogramAssignmentCompletionData
    >
{
  config?: ExtractFromHistogramAssignmentConfiguration | undefined
  completionData?: ExtractFromHistogramAssignmentCompletionData | undefined
  updateCompletionData = new EventEmitter<
    Partial<ExtractFromHistogramAssignmentCompletionData>
  >()
  createInteractionLog = new EventEmitter<unknown>()
}
