import { EventEmitter } from '@angular/core'
import { fireEvent, render } from '@testing-library/angular'
import { AnimatedDiceComponent } from './animated-dice.component'

describe('AnimatedDiceComponent', () => {
  it('should render', async () => {
    const renderResult = await render(AnimatedDiceComponent, {})
    expect(renderResult).toBeTruthy()
  })

  it("should output the roll's result AFTER the animation is done", async () => {
    jest.useFakeTimers()
    const output = new EventEmitter<number[]>()
    const outputSpy = jest.fn()
    const sub = output.subscribe(outputSpy)
    const renderResult = await render(AnimatedDiceComponent, {
      componentOutputs: {
        roll: output,
      },
    })

    fireEvent.click(await renderResult.findByTestId('roll-dice-button'))
    expect(outputSpy).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1_200)

    expect(outputSpy).toHaveBeenCalled()

    sub.unsubscribe()
    jest.useRealTimers()
  })

  describe('getNextRolls', () => {
    it('should return a subsection of initial rolls if applicable', async () => {
      const n = 100
      const initialRolls = Array.from({ length: 2 * n }, () => 7)
      const renderResult = await render(AnimatedDiceComponent, {
        componentProperties: {
          initialRolls,
          count: n,
        },
      })
      const component = renderResult.fixture.componentInstance

      const actual = component.getNextRolls()

      expect(actual).toEqual(initialRolls.slice(0, n))
    })

    it('should return remaining initial rolls + random ones if applicable', async () => {
      // Setup: we already rolled n times and have 2n initial rolls. We roll 2n times per click.
      // -> next click should contain n of the initial rolls and n other rolls
      // we abuse the fact that actual rolls are only between 1 and 6. initial rolls are 7
      // so we can easily distinguish them
      const n = 100
      const initialRolls = Array.from({ length: 2 * n }, () => 7)
      const renderResult = await render(AnimatedDiceComponent, {
        componentProperties: {
          initialRolls,
          count: 2 * n,
          amountPreviouslyRolled: n,
        },
      })
      const component = renderResult.fixture.componentInstance

      const actual = component.getNextRolls()

      expect(actual).toHaveLength(2 * n)
      expect(actual.slice(0, n)).toEqual(initialRolls.slice(n))
      expect(actual.slice(n)).not.toContain(7)
    })
  })
})
