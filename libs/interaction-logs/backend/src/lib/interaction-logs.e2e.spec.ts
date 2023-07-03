import { INestApplication, ValidationPipe } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { HttpStatusCode } from 'axios'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection, connect } from 'mongoose'
import { AuthGuard, RoleGuard } from 'nest-keycloak-connect'
import * as request from 'supertest'
import { researcherUser, studentUser } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { MockAuthGuard, MockRoleGuard } from '@stochus/auth/backend'
import { InteractionLogCreateDto } from '@stochus/interaction-logs/dtos'
import { InteractionLogsModule } from './interaction-logs.module'

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
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .overrideGuard(RoleGuard)
      .useClass(MockRoleGuard)
      .compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())

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

  it('should save a request with payload', async () => {
    mockAuthGuard.setCurrentUser(studentUser)

    const dto: InteractionLogCreateDto = {
      payload: {
        biz: 123,
        asdf: true,
      },
    }

    await request(app.getHttpServer())
      .post('/interaction-logs')
      .send(dto)
      .expect(HttpStatusCode.Created)

    mockAuthGuard.setCurrentUser(researcherUser)
    const response = await request(app.getHttpServer())
      .get('/interaction-logs')
      .send()
      .expect(HttpStatusCode.Ok)

    expect(response.body).toHaveLength(1)
    expect(
      plainToInstance(InteractionLogCreateDto, response.body[0], {
        // excludeExtraneousValues: true,
      }),
    ).toEqual(dto)
  })
})
