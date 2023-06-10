import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { InteractionLogsModule } from './interaction-logs.module'
import * as request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, Connection } from 'mongoose'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthGuard, RoleGuard } from 'nest-keycloak-connect'
import { HttpStatusCode } from 'axios'
import { researcherUser, studentUser } from '@stochus/auth/shared'
import { MockAuthGuard, MockRoleGuard } from '@stochus/auth/backend'

describe('Interaction Logs', () => {
  let app: INestApplication

  let mongod: MongoMemoryServer
  let mongoConnection: Connection

  let mockAuthGuard: MockAuthGuard

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    mongoConnection = (await connect(mongod.getUri())).connection
    // logsModel = mongoConnection.model(InteractionLog.name, InteractionLogSchema)

    const moduleRef = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(mongod.getUri()), InteractionLogsModule],
      providers: [
        // {
        //   provide: APP_GUARD,
        //   useClass: RoleGuard,
        // },
      ],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .overrideGuard(RoleGuard)
      .useClass(MockRoleGuard)
      .compile()

    app = moduleRef.createNestApplication()

    mockAuthGuard = await app.resolve(AuthGuard)

    await app.init()
  })

  afterAll(async () => {
    await app.close()

    await mongoConnection.dropDatabase()
    await mongoConnection.close()
    await mongod.stop()
  })

  it('should deny the request if nobody is authorized', async () => {
    mockAuthGuard.setCurrentUser(undefined)

    await request(app.getHttpServer())
      .post('/interaction-logs')
      .send({})
      .expect(HttpStatusCode.Unauthorized)
  })

  it('should deny the request if roles are missing', async () => {
    mockAuthGuard.setCurrentUser(researcherUser)

    await request(app.getHttpServer())
      .post('/interaction-logs')
      .send({})
      .expect(HttpStatusCode.Forbidden)
  })

  it('should deny a DTO without payload', async () => {
    mockAuthGuard.setCurrentUser(studentUser)

    await request(app.getHttpServer())
      .post('/interaction-logs')
      .send({})
      .expect(HttpStatusCode.BadRequest)
  })
})
