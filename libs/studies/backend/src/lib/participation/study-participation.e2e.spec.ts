import GroupRepresentation from '@keycloak/keycloak-admin-client/lib/defs/groupRepresentation'
import { INestApplication } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { MongooseModule } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { HttpStatusCode } from 'axios'
import { validate } from 'class-validator'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection, connect } from 'mongoose'
import * as request from 'supertest'
import {
  mathmagicianStudentUser,
  researcherUserReggie,
} from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import {
  StudyParticipationWithAssignmentCompletionsDto,
  validStudyDto,
} from '@stochus/studies/shared'
import {
  AssignmentCompletion,
  AssignmentCompletionSchema,
  CompletionsService,
} from '@stochus/assignments/core/backend'
import {
  KeycloakAdminService,
  MockAuthGuard,
  MockRoleGuard,
} from '@stochus/auth/backend'
import { registerGlobalUtilitiesToApp } from '@stochus/core/backend'
import { StudiesBackendService } from '../studies-backend.service'
import { StudyParticipationBackendService } from './study-participation-backend.service'
import { StudyParticipationController } from './study-participation.controller'
import {
  StudyParticipation,
  StudyParticipationSchema,
} from './study-participation.schema'

describe('Study Participation', () => {
  let app: INestApplication

  let mongod: MongoMemoryServer
  let mongoConnection: Connection

  let mockAuthGuard: MockAuthGuard

  const eventEmitterMock = {
    emit: jest.fn(),
  }

  beforeAll(async () => {
    jest.resetAllMocks()
    mongod = await MongoMemoryServer.create()
    mongoConnection = (await connect(mongod.getUri())).connection

    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri()),
        MongooseModule.forFeature([
          {
            name: AssignmentCompletion.name,
            schema: AssignmentCompletionSchema,
          },
          {
            name: StudyParticipation.name,
            schema: StudyParticipationSchema,
          },
        ]),
      ],
      providers: [
        StudyParticipationBackendService,
        {
          provide: StudiesBackendService,
          useValue: {
            getById: jest.fn().mockResolvedValue(validStudyDto),
          },
        },
        {
          provide: KeycloakAdminService,
          useValue: {
            getGroupsForUser: jest.fn().mockResolvedValue([
              {
                id: validStudyDto.participantsGroupId,
              },
            ] satisfies GroupRepresentation[]),
          },
        },
        CompletionsService,
        {
          provide: EventEmitter2,
          useValue: eventEmitterMock,
        },
      ],
      controllers: [StudyParticipationController],
    }).compile()

    app = moduleRef.createNestApplication()
    registerGlobalUtilitiesToApp(app)

    mockAuthGuard = new MockAuthGuard()
    app.useGlobalGuards(mockAuthGuard)
    app.useGlobalGuards(new MockRoleGuard(await app.resolve(Reflector)))
    // studyParticipationModel = await app.resolve(
    //   getModelToken(StudyParticipation.name),
    // )

    await app.init()
  })

  afterAll(async () => {
    await app.close()

    await mongoConnection.dropDatabase()
    await mongoConnection.close()
    await mongod.stop()
  })

  it('should deny creation if nobody is authorized', async () => {
    mockAuthGuard.setCurrentUser(undefined)

    await request(app.getHttpServer())
      .post(`/studies/participate/${validStudyDto.id}`)
      .send({})
      .expect(HttpStatusCode.Unauthorized)

    expect(eventEmitterMock.emit).not.toHaveBeenCalled()
  })

  it('should deny creation if roles are missing', async () => {
    mockAuthGuard.setCurrentUser(researcherUserReggie)

    await request(app.getHttpServer())
      .post(`/studies/participate/${validStudyDto.id}`)
      .send({})
      .expect(HttpStatusCode.Forbidden)

    expect(eventEmitterMock.emit).not.toHaveBeenCalled()
  })

  it("should deny creation when study ID isn't valid", async () => {
    mockAuthGuard.setCurrentUser(mathmagicianStudentUser)

    await request(app.getHttpServer())
      .post(`/studies/participate/not-a-mongo-id`)
      .send({})
      .expect(HttpStatusCode.BadRequest)

    expect(eventEmitterMock.emit).not.toHaveBeenCalled()
  })

  it('should successfully create a new participation', async () => {
    mockAuthGuard.setCurrentUser(mathmagicianStudentUser)

    const response = await request(app.getHttpServer())
      .post(`/studies/participate/${validStudyDto.id}`)
      .send({})
      .expect(HttpStatusCode.Created)

    const body = plainToInstance(
      StudyParticipationWithAssignmentCompletionsDto,
      response.body,
    )
    await expect(validate(body)).resolves.toEqual([])

    expect(eventEmitterMock.emit).toHaveBeenCalledTimes(1)
  })
})
