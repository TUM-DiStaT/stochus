import { Validators } from '@angular/forms'
import { validateSync } from 'class-validator'
import {
  DetermineDiceFairnessAssignment,
  DetermineDiceFairnessAssignmentCompletionData,
  DetermineDiceFairnessAssignmentConfiguration,
} from '@stochus/assignments/determine-dice-fairness/shared'
import { plainToInstance } from '@stochus/core/shared'
import { AssignmentForFrontend } from '@stochus/assignments/model/frontend'
import { DetermineDiceFairnessAssignmentProcessComponent } from './assignment-process/determine-dice-fairness-assignment-process.component'
import { DetermineDiceFairnessConfigFormComponent } from './config-form/determine-dice-fairness-config-form.component'
import { DetermineDiceFairnessFeedbackComponent } from './feedback/determine-dice-fairness-feedback.component'

export const DetermineDiceFairnessAssignmentForFrontend: AssignmentForFrontend<
  DetermineDiceFairnessAssignmentConfiguration,
  DetermineDiceFairnessAssignmentCompletionData
> = {
  ...DetermineDiceFairnessAssignment,
  completionProcessComponent: DetermineDiceFairnessAssignmentProcessComponent,
  configurationInputFormComponent: DetermineDiceFairnessConfigFormComponent,
  feedbackComponent: DetermineDiceFairnessFeedbackComponent,
  generateConfigFormControl: (fb, { proportions, initialRolls, dicePerRoll }) =>
    fb.group(
      {
        proportions: [proportions, [Validators.required]],
        initialRolls: [initialRolls, [Validators.required]],
        dicePerRoll: [dicePerRoll, [Validators.required]],
      },
      {
        validators: [
          (formControl) => {
            const errors = validateSync(
              plainToInstance(
                DetermineDiceFairnessAssignmentConfiguration,
                formControl.value,
              ),
            )

            errors.reduce(
              (errors, currError) => ({
                ...(errors ?? {}),
                proportionsDtoError: currError.property === 'proportions',
                initialRollsDtoError: currError.property === 'initialRolls',
                dicePerRollDtoError: currError.property === 'dicePerRoll',
              }),
              null as Record<string, boolean> | null,
            )

            if (errors.length > 0) {
              return { invalidConfig: true }
            }
            return null
          },
        ],
      },
    ),
}
