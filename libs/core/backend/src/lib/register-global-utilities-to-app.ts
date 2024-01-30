import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

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

  const swaggerConfig = new DocumentBuilder().setTitle('Stochus API').build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, swaggerDocument)
}
