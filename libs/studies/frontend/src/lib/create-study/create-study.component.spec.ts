import { render, screen, within } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { UserEvent } from '@testing-library/user-event/setup/setup'
import 'reflect-metadata'
import { Observable } from 'rxjs'
import { GuessRandomNumberAssignment } from '@stochus/assignments/demos/guess-random-number/shared'
import { StudyCreateDto, StudyDto } from '@stochus/studies/shared'
import { StudiesService } from '../studies.service'
import { CreateStudyComponent } from './create-study.component'

describe('CreateStudyComponent', () => {
  const setup = async () => {
    const getAllOwnedByUserMock = jest.fn<Observable<StudyDto[]>, []>()
    const createStudyMock = jest.fn<Observable<StudyDto>, [StudyCreateDto]>()
    return {
      user: userEvent.setup(),
      getAllOwnedByUserMock,
      createStudyMock,
      ...(await render(CreateStudyComponent, {
        componentProviders: [
          {
            provide: StudiesService,
            useValue: {
              getAllOwnedByUser: getAllOwnedByUserMock,
              create: createStudyMock,
            } satisfies Partial<StudiesService>,
          },
        ],
      })),
    }
  }
  const getTaskNameInput = () => screen.getByLabelText('Name')
  const getTaskDescriptionInput = () => screen.getByLabelText('Beschreibung')
  const getStartDateInput = () => screen.getByTestId('start-date-input')
  const getEndDateInput = () => screen.getByTestId('end-date-input')
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
    await user.type(getStartDateInput(), '2023-01-01')
    await user.type(getEndDateInput(), '2023-01-02')
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

  it('should create the study when a valid form is submitted', async () => {
    const { user, createStudyMock } = await setup()

    await enterValidBaseData(user)

    await user.click(getSubmitButton())

    expect(createStudyMock).toHaveBeenCalledTimes(1)
    expect(createStudyMock).toHaveBeenCalledWith({
      description: 'Super cool testing study!',
      endDate: new Date('2023-01-02T00:00:00.000Z'),
      name: 'Test study',
      startDate: new Date('2023-01-01T00:00:00.000Z'),
      tasks: [],
    })
  })

  it('should not create the study when an invalid form is submitted', async () => {
    const { user, createStudyMock } = await setup()

    await enterValidBaseData(user)
    await addTask(user)

    await user.click(getSubmitButton())

    expect(createStudyMock).not.toHaveBeenCalled()
  })

  it('should not allow the start date to be after the end date', async () => {
    const { user } = await setup()

    await enterValidBaseData(user)

    await user.type(getStartDateInput(), '2023-01-02')
    await user.type(getEndDateInput(), '2023-01-01')

    expect(getSubmitButton()).toBeDisabled()
  })

  it.todo('should convert the data to a DTO correctly')
})
