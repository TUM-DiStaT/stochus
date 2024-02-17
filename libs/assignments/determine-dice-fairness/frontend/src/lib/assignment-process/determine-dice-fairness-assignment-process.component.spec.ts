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

  it('should return a subsection of initial rolls if applicable', () => {
    const component = fixture?.componentInstance

    expect(component).toBeDefined()
    if (!component) {
      throw new Error('just here to tell TS that component exists.')
    }

    const n = 100
    const initialRolls = Array.from({ length: 2 * n }, () => 7)

    component.config.initialRolls = initialRolls
    component.config.dicePerRoll = n

    const actual = component.getNextRolls()

    expect(actual).toEqual(initialRolls.slice(0, n))
  })

  it('should return remaining initial rolls + random ones if applicable', () => {
    const component = fixture?.componentInstance

    expect(component).toBeDefined()
    if (!component) {
      throw new Error('just here to tell TS that component exists.')
    }

    // Setup: we already rolled n times and have 2n initial rolls. We roll 2n times per click.
    // -> next click should contain n of the initial rolls and n other rolls
    // we abuse the fact that actual rolls are only between 1 and 6. initial rolls are 7
    // so we can easily distinguish them
    const n = 100
    const initialRolls = Array.from({ length: 2 * n }, () => 7)

    component.config.initialRolls = initialRolls
    component.config.dicePerRoll = 2 * n
    component.completionData.resultFrequencies = [0, 0, 0, 0, 0, n]

    const actual = component.getNextRolls()

    expect(actual).toHaveLength(2 * n)
    expect(actual.slice(0, n)).toEqual(initialRolls.slice(n))
    expect(actual.slice(n)).not.toContain(7)
  })
})
