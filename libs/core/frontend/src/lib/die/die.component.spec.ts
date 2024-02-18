import { render, within } from '@testing-library/angular'
import { BehaviorSubject } from 'rxjs'
import { DieComponent } from './die.component'

describe('DieComponent', () => {
  it('should render', async () => {
    const renderResult = await render(DieComponent, {})
    expect(renderResult).toBeTruthy()
  })

  it('should render all sides correctly', async () => {
    const renderResult = await render(DieComponent, {})

    expect(renderResult.queryByTestId('side-6')).toBeNull()
    for (let i = 0; i < 6; i++) {
      const side = await renderResult.findByTestId(`side-${i}`)

      for (let j = 0; j < i; j++) {
        await within(side).findByTestId(`side-${i}-dot-${j}`)
      }
    }
  })

  it('should render the correct side as per the input', async () => {
    const valueSubject = new BehaviorSubject(3)
    const renderResult = await render(DieComponent, {
      componentProperties: {
        value$: valueSubject.asObservable(),
      },
    })

    await renderResult.findByTestId('show-3')

    valueSubject.next(5)
    await renderResult.findByTestId('show-5')
    expect(renderResult.queryByTestId('show-3')).toBeNull()
  })

  describe('getDotGridPositionClassNames', () => {
    let instance: DieComponent | undefined

    beforeAll(async () => {
      const renderResult = await render(DieComponent, {})
      expect(renderResult.fixture.componentInstance).toBeInstanceOf(
        DieComponent,
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
})
