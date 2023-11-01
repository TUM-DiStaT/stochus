/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { HttpLoggingInterceptor } from './app/http-logging.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new HttpLoggingInterceptor())
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
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  const port = process.env.PORT || 3333
  await app.listen(port)
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  )
}

bootstrap()
