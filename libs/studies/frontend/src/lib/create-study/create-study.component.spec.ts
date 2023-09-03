import { render, screen, within } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { UserEvent } from '@testing-library/user-event/setup/setup'
import 'reflect-metadata'
import { GuessRandomNumberAssignment } from '@stochus/assignments/demos/guess-random-number/shared'
import { CreateStudyComponent } from './create-study.component'

describe('CreateStudyComponent', () => {
  const setup = async () => ({
    user: userEvent.setup(),
    ...(await render(CreateStudyComponent)),
  })
  const getTaskNameInput = () => screen.getByLabelText('Name')
  const getTaskDescriptionInput = () => screen.getByLabelText('Beschreibung')
  const getSubmitButton = () => screen.getByTestId('submit-button')
  const getAddTaskButton = () => screen.getByTestId('add-task-button')
  const getAllTaskWrappers = () => screen.getAllByTestId('task-wrapper')
  const getAssignmentSelector = (taskWrapper: HTMLElement) =>
    within(taskWrapper).getByLabelText('Aufgabentyp')
  const getDeleteTaskButton = (taskWrapper: HTMLElement) =>
    within(taskWrapper).getByTestId('delete-task-button')

  const enterValidBaseData = async (user: UserEvent) => {
    await user.type(getTaskNameInput(), 'Test study')
    await user.type(getTaskDescriptionInput(), 'Super cool testing study!')
  }

  function expectDefined<T>(v: T | null | undefined): asserts v is T {
    expect(v).toBeDefined()
    expect(v).not.toBeNull()
  }

  const addTask = async (user: UserEvent, assignmentId?: string) => {
    await user.click(getAddTaskButton())
    const task = getAllTaskWrappers().at(-1)
    expectDefined(task)

    if (assignmentId !== undefined) {
      await user.selectOptions(getAssignmentSelector(task), assignmentId)
    }

    return task
  }

  it('should render the basic fields', async () => {
    await setup()

    expect(getTaskNameInput()).toBeInTheDocument()
    expect(getTaskDescriptionInput()).toBeInTheDocument()
  })

  it('should initially disable submit button', async () => {
    await setup()

    expect(getSubmitButton()).toBeDisabled()
  })

  it('should allow saving a study without any tasks', async () => {
    const { user } = await setup()

    await enterValidBaseData(user)

    expect(getSubmitButton()).toBeEnabled()
  })

  it('should not allow saving a study with an unspecified assignment', async () => {
    const { user } = await setup()

    await enterValidBaseData(user)
    await addTask(user)

    expect(getSubmitButton()).toBeDisabled()
  })

  it('should prefill the assignment config to be valid', async () => {
    const { user } = await setup()

    await enterValidBaseData(user)
    await addTask(user, GuessRandomNumberAssignment.id)

    expect(getSubmitButton()).toBeEnabled()
  })

  it('should not allow saving a study with an invalid assignment', async () => {
    const { user } = await setup()

    await enterValidBaseData(user)
    const task = await addTask(user, GuessRandomNumberAssignment.id)

    await user.clear(within(task).getByTestId('target-number-input'))

    expect(getSubmitButton()).toBeDisabled()
  })

  it('should be able to delete a task, which should reflect on form validity', async () => {
    const { user } = await setup()

    await enterValidBaseData(user)
    const task = await addTask(user)

    await user.click(getDeleteTaskButton(task))

    expect(getSubmitButton()).toBeEnabled()
  })
})
