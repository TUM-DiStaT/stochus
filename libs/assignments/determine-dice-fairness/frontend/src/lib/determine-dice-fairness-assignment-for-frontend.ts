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
  generateConfigFormControl: (
    fb,
    { proportions, initialRolls, dicePerRoll },
  ) => {
    const proportionsArrayControl = fb.array(
      proportions.map((proportion) => [proportion, [Validators.min(0)]]),
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        (control) => {
          const sum = (control.value as number[]).reduce(
            (acc, curr) => acc + curr,
            0,
          )
          return sum > 0 ? null : { atLeastOneNonZero: true }
        },
      ],
    )
    return fb.group(
      {
        // This type casting is necessary because Angular's FormModel
        // only accepts direct FormControls, no nested form controls like FormArrays
        proportions: proportionsArrayControl as unknown as [number[]],
        initialRolls: [initialRolls, []],
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

            return errors.reduce(
              (errors, currError) => ({
                ...(errors ?? {}),
                proportionsDtoError: currError.property === 'proportions',
                initialRollsDtoError: currError.property === 'initialRolls',
                dicePerRollDtoError: currError.property === 'dicePerRoll',
              }),
              null as Record<string, boolean> | null,
            )
          },
        ],
      },
    )
  },
}
