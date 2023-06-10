import { Module } from '@nestjs/common'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (): MongooseModuleOptions => {
        const server = new MongoMemoryServer()
        const uri = server.getUri()
        return {
          uri,
        }
      },
    }),
  ],
})
export class MongoDbTestingModule {}
