import { render, within } from '@testing-library/angular'
import { AnimatedDiceComponent } from './animated-dice.component'

describe('AnimatedDiceComponent', () => {
  it('should render', async () => {
    const renderResult = await render(AnimatedDiceComponent, {})
    expect(renderResult).toBeTruthy()
  })

  it('should render all sides correctly', async () => {
    const renderResult = await render(AnimatedDiceComponent, {})

    expect(renderResult.queryByTestId('side-6')).toBeNull()
    for (let i = 0; i < 6; i++) {
      const side = await renderResult.findByTestId(`side-${i}`)

      for (let j = 0; j < i; j++) {
        await within(side).findByTestId(`side-${i}-dot-${j}`)
      }
    }
  })

  describe('getDotGridPositionClassNames', () => {
    let instance: AnimatedDiceComponent | undefined

    beforeAll(async () => {
      const renderResult = await render(AnimatedDiceComponent, {})
      expect(renderResult.fixture.componentInstance).toBeInstanceOf(
        AnimatedDiceComponent,
      )
      instance = renderResult.fixture.componentInstance
    })

    it.each([
      // 1
      [0, 0, ['col-start-2', 'row-start-2']],
      // 2
      [1, 0, ['col-start-1', 'row-start-1']],
      [1, 1, ['col-start-3', 'row-start-3']],
      // 3
      [2, 0, ['col-start-1', 'row-start-1']],
      [2, 1, ['col-start-2', 'row-start-2']],
      [2, 2, ['col-start-3', 'row-start-3']],
      // 4
      [3, 0, ['col-start-1', 'row-start-1']],
      [3, 1, ['col-start-1', 'row-start-3']],
      [3, 2, ['col-start-3', 'row-start-1']],
      [3, 3, ['col-start-3', 'row-start-3']],
      // 5
      [4, 0, ['col-start-1', 'row-start-1']],
      [4, 1, ['col-start-1', 'row-start-3']],
      [4, 2, ['col-start-3', 'row-start-1']],
      [4, 3, ['col-start-3', 'row-start-3']],
      [4, 4, ['col-start-2', 'row-start-2']],
      // 6
      [5, 0, ['col-start-1', 'row-start-1']],
      [5, 1, ['col-start-1', 'row-start-2']],
      [5, 2, ['col-start-1', 'row-start-3']],
      [5, 3, ['col-start-3', 'row-start-1']],
      [5, 4, ['col-start-3', 'row-start-2']],
      [5, 5, ['col-start-3', 'row-start-3']],
    ])(
      "should render the %p. slide's %p. dot correctly (%p)",
      async (sideIndex, dotIndex, expectedClassNames) => {
        expect(instance).toBeDefined()
        for (const className of expectedClassNames) {
          const classNames = instance
            ?.getDotGridPositionClassNames(sideIndex, dotIndex)
            .split(' ')
          expect(classNames).toContain(className)
        }
      },
    )
  })

  it.todo("should display 1 while it's not told to display anything else")
})
