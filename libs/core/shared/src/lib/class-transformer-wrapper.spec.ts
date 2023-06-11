import { plainToInstance } from './class-transformer-wrapper'
import { IsNotEmpty } from 'class-validator'

class SomeDto {
  @IsNotEmpty()
  foo!: string
}

describe('plainToInstance', () => {
  it('should exclude extraneous values by default', () => {
    const plain = {
      foo: 'bar',
      extraneousProperty: 123,
    }
    expect(plainToInstance(SomeDto, plain)).not.toHaveProperty(
      'extraneousProperty',
    )
  })
})
