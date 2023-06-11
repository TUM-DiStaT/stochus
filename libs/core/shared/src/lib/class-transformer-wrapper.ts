import { plainToInstance as originalPlainToInstance } from 'class-transformer'
import {
  ClassConstructor,
  ClassTransformOptions,
} from 'class-transformer/types/interfaces'

export function plainToInstance<T, V>(
  cls: ClassConstructor<T>,
  plain: V[],
  options?: ClassTransformOptions,
): T[]
export function plainToInstance<T, V>(
  cls: ClassConstructor<T>,
  plain: V,
  options?: ClassTransformOptions,
): T
export function plainToInstance<T, V>(
  cls: ClassConstructor<T>,
  plain: V | V[],
  options?: ClassTransformOptions,
) {
  const optionsWithCustomDefaults: ClassTransformOptions = {
    excludeExtraneousValues: true,
    ...options,
  }
  return originalPlainToInstance(cls, plain, optionsWithCustomDefaults)
}
