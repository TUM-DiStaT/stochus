import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator'

type KeysWithValuesOfType<O, V> = {
  [K in keyof O]: O[K] extends V ? K : never
}[keyof O]

export const IsBefore =
  <T extends object>(
    property: KeysWithValuesOfType<T, Date>,
    validationOptions?: ValidationOptions,
  ) =>
  (object: T, propertyName: KeysWithValuesOfType<T, Date>) => {
    registerDecorator({
      name: 'isBefore',
      target: object.constructor,
      propertyName: propertyName as string,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: Date, args: ValidationArguments) {
          const relatedPropertyName: KeysWithValuesOfType<T, Date> =
            args.constraints[0]
          const obj = args.object as T
          const relatedValue = obj[relatedPropertyName]
          return (
            value instanceof Date &&
            relatedValue instanceof Date &&
            value.valueOf() < relatedValue.valueOf()
          )
        },
      },
    })
  }
