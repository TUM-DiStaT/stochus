import { EventEmitter } from '@angular/core'
import { ComponentFixture } from '@angular/core/testing'
import { render } from '@testing-library/angular'
import 'chartjs-plugin-datalabels'
import 'jest-canvas-mock'
import {
  DetermineDiceFairnessAssignmentCompletionData,
  DetermineDiceFairnessAssignmentConfiguration,
} from '@stochus/assignments/determine-dice-fairness/shared'
import { AssignmentProcessProps } from '@stochus/assignments/model/frontend'
import { DetermineDiceFairnessAssignmentProcessComponent } from './determine-dice-fairness-assignment-process.component'

describe('DetermineDiceFairnessAssignmentProcessComponent', () => {
  let fixture:
    | ComponentFixture<DetermineDiceFairnessAssignmentProcessComponent>
    | undefined

  beforeEach(async () => {
    const renderResult = await render(
      DetermineDiceFairnessAssignmentProcessComponent,
      {
        componentProperties: {
          updateCompletionData: new EventEmitter(),
          config: {
            proportions: Array.from({ length: 6 }, () => 1),
            initialRolls: [],
            dicePerRoll: 3,
          },
          completionData: {
            resultFrequencies: [],
            confidence: 3,
            progress: 0,
          },
          createInteractionLog: new EventEmitter(),
        } satisfies AssignmentProcessProps<
          DetermineDiceFairnessAssignmentConfiguration,
          DetermineDiceFairnessAssignmentCompletionData
        >,
      },
    )
    fixture = renderResult.fixture
  })

  it('should create', () => {
    expect(fixture?.componentInstance).toBeTruthy()
  })
})
