import { INestApplication } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { MongooseModule, getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { HttpStatusCode } from 'axios'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection, Model, connect } from 'mongoose'
import * as request from 'supertest'
import { guessRandomNumberJustStartedCompletionDto } from '@stochus/assignment/core/shared'
import { researcherUserReggie, studentUser } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { MockAuthGuard, MockRoleGuard } from '@stochus/auth/backend'
import { registerGlobalUtilitiesToApp } from '@stochus/core/backend'
import { StudyParticipationBackendService } from '@stochus/studies/backend'
import { InteractionLogCreateDto } from '@stochus/interaction-logs/dtos'
import { InteractionLogsController } from './interaction-logs.controller'
import { InteractionLog, InteractionLogSchema } from './interaction-logs.schema'
import { InteractionLogsService } from './interaction-logs.service'

describe('Interaction Logs', () => {
  let app: INestApplication

  let mongod: MongoMemoryServer
  let mongoConnection: Connection
  let interactionLogsModel: Model<InteractionLog>

  let mockAuthGuard: MockAuthGuard

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    mongoConnection = (await connect(mongod.getUri())).connection

    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri()),
        MongooseModule.forFeature([
          {
            name: InteractionLog.name,
            schema: InteractionLogSchema,
          },
        ]),
      ],
      providers: [
        InteractionLogsService,
        {
          provide: StudyParticipationBackendService,
          useValue: {
            assertCompletionIsPartOfActiveStudy: jest
              .fn()
              .mockResolvedValue(undefined),
          },
        },
      ],
      controllers: [InteractionLogsController],
    }).compile()

    app = moduleRef.createNestApplication()
    registerGlobalUtilitiesToApp(app)

    mockAuthGuard = new MockAuthGuard()
    app.useGlobalGuards(mockAuthGuard)
    app.useGlobalGuards(new MockRoleGuard(await app.resolve(Reflector)))
    interactionLogsModel = await app.resolve(getModelToken(InteractionLog.name))

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
      .post(
        `/interaction-logs/assignment-completion/${guessRandomNumberJustStartedCompletionDto.id}`,
      )
      .send({})
      .expect(HttpStatusCode.Unauthorized)
  })

  it('should deny the request if roles are missing', async () => {
    mockAuthGuard.setCurrentUser(researcherUserReggie)

    await request(app.getHttpServer())
      .post(
        `/interaction-logs/assignment-completion/${guessRandomNumberJustStartedCompletionDto.id}`,
      )
      .send({})
      .expect(HttpStatusCode.Forbidden)
  })

  it('should deny a DTO without payload', async () => {
    mockAuthGuard.setCurrentUser(studentUser)

    await request(app.getHttpServer())
      .post(
        `/interaction-logs/assignment-completion/${guessRandomNumberJustStartedCompletionDto.id}`,
      )
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

    const response = await request(app.getHttpServer())
      .post(
        `/interaction-logs/assignment-completion/${guessRandomNumberJustStartedCompletionDto.id}`,
      )
      .send(dto)
      .expect(HttpStatusCode.Created)

    expect(response.body).toHaveProperty('_id')

    const result = await interactionLogsModel.findById(response.body._id)

    expect(result).toBeDefined()
    expect(plainToInstance(InteractionLogCreateDto, result)).toEqual(dto)
  })
})
