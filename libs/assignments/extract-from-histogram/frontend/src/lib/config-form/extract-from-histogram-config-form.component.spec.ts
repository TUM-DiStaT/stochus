import { FormBuilder } from '@angular/forms'
import { render, screen, within } from '@testing-library/angular'
import { userEvent } from '@testing-library/user-event'
import 'jest-canvas-mock'
import { FormModel } from 'ngx-mf'
import {
  ExtractFromHistogramAssignment,
  ExtractFromHistogramAssignmentConfiguration,
} from '@stochus/assignments/extract-from-histogram-assignment/shared'
import { AssignmentConfigFormProps } from '@stochus/assignments/model/frontend'
import { ExtractFromHistogramAssignmentForFrontend } from '../extract-from-histogram-assignment-for-frontend'
import { ExtractFromHistogramConfigFormComponent } from './extract-from-histogram-config-form.component'

describe('GuessRandomNumberConfigFormComponent', () => {
  let formControl: FormModel<ExtractFromHistogramAssignmentConfiguration>

  beforeEach(async () => {
    formControl =
      ExtractFromHistogramAssignmentForFrontend.generateConfigFormControl(
        new FormBuilder(),
        ExtractFromHistogramAssignment.getRandomConfig(),
      )
    await render(ExtractFromHistogramConfigFormComponent, {
      componentProperties: {
        formControl,
      } satisfies AssignmentConfigFormProps<ExtractFromHistogramAssignmentConfiguration>,
    })
  })

  it('should have mean and median as options', async () => {
    const targetPropertySelector = screen.getByTestId<HTMLSelectElement>(
      'target-property-select',
    )
    expect(targetPropertySelector).toBeInTheDocument()

    const meanOption = within(
      targetPropertySelector,
    ).getByRole<HTMLOptionElement>('option', { name: 'Durchschnitt' })
    const medianOption = within(
      targetPropertySelector,
    ).getByRole<HTMLOptionElement>('option', { name: 'Median' })

    expect(meanOption).toBeInTheDocument()
    expect(medianOption).toBeInTheDocument()

    await userEvent.selectOptions(targetPropertySelector, meanOption)

    expect(formControl.valid).toBe(true)

    await userEvent.selectOptions(targetPropertySelector, medianOption)

    expect(formControl.valid).toBe(true)
  })

  it('should convert valid CSV to the array', async () => {
    const dataInput = screen.getByTestId<HTMLTextAreaElement>('data-textarea')
    expect(dataInput).toBeInTheDocument()

    await userEvent.clear(dataInput)
    // Allow for leading and trailing spaces and commas
    await userEvent.type(dataInput, ' , 1,2, 3,4,5  ,6,7,8,9,   10  , ')

    expect(formControl.valid).toBe(true)
    expect(
      screen.queryByTestId('invalid-csv-error-message'),
    ).not.toBeInTheDocument()
    expect(dataInput).not.toHaveClass('textarea-error')
    expect(formControl.value.data).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it.each(['1, a, 2', '1.1, 2'])(
    'should raise an error if not valid integer CSV: %p',
    async (csv: string) => {
      const dataInput = screen.getByTestId<HTMLTextAreaElement>('data-textarea')
      expect(dataInput).toBeInTheDocument()

      await userEvent.clear(dataInput)
      await userEvent.type(dataInput, csv)

      expect(formControl.invalid).toBe(true)
      expect(dataInput).toHaveClass('textarea-error')
      expect(
        screen.queryByTestId('invalid-csv-error-message'),
      ).toBeInTheDocument()
    },
  )

  it('should raise an error if data is empty', async () => {
    const dataInput = screen.getByTestId<HTMLTextAreaElement>('data-textarea')
    expect(dataInput).toBeInTheDocument()

    await userEvent.clear(dataInput)

    expect(formControl.invalid).toBe(true)
    expect(dataInput).toHaveClass('textarea-error')
    expect(
      screen.queryByTestId('invalid-csv-error-message'),
    ).toBeInTheDocument()
  })
})
