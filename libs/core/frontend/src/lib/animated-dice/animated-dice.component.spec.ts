import { render } from '@testing-library/angular'
import { AnimatedDiceComponent } from './animated-dice.component'

describe('AnimatedDiceComponent', () => {
  it('should render', async () => {
    const renderResult = await render(AnimatedDiceComponent, {})
    expect(renderResult).toBeTruthy()
  })

  it.todo("should display 1 while it's not told to display anything else")
})
