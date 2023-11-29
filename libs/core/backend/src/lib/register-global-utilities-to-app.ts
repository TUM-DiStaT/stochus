import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

export const registerGlobalUtilitiesToApp = (app: INestApplication) => {
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  )
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        excludeExtraneousValues: true,
      },
      transform: true,
    }),
  )
}
