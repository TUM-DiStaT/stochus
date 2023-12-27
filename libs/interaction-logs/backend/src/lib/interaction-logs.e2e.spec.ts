import { INestApplication } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter'
import { MongooseModule, getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { HttpStatusCode } from 'axios'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection, Model, Types, connect } from 'mongoose'
import * as request from 'supertest'
import { guessRandomNumberJustStartedCompletionDto } from '@stochus/assignment/core/shared'
import { GuessRandomNumberAssignment } from '@stochus/assignments/demos/guess-random-number/shared'
import {
  mathmagicianStudentUser,
  researcherUserReggie,
  studentUser,
} from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import {
  validStudyDto,
  validStudyParticipationDto,
} from '@stochus/studies/shared'
import { AssignmentCompletion } from '@stochus/assignments/core/backend'
import { MockAuthGuard, MockRoleGuard } from '@stochus/auth/backend'
import {
  AssignmentCompletedEventPayload,
  StudyParticipationCreatedEventPayload,
  assignmentCompletedEventToken,
  registerGlobalUtilitiesToApp,
  studyParticipationCreatedEventToken,
} from '@stochus/core/backend'
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
  let eventEmitter: EventEmitter2
  let studyParticipationBackendService: StudyParticipationBackendService

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
        EventEmitterModule.forRoot(),
      ],
      providers: [
        InteractionLogsService,
        {
          provide: StudyParticipationBackendService,
          useValue: {
            assertCompletionIsPartOfActiveStudy: jest
              .fn()
              .mockResolvedValue(undefined),
            getStudyByParticipation: jest.fn().mockResolvedValue(validStudyDto),
            assertUserMayParticipateInStudy: jest
              .fn()
              .mockResolvedValue(undefined),
            getParticipationForAssignmentCompletion: jest
              .fn()
              .mockResolvedValue(null),
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
    eventEmitter = await app.resolve(EventEmitter2)
    studyParticipationBackendService = await app.resolve(
      StudyParticipationBackendService,
    )

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

  it('should save an assignment request with payload', async () => {
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

  it('should save a general study log with payload', async () => {
    mockAuthGuard.setCurrentUser(studentUser)

    const dto: InteractionLogCreateDto = {
      payload: {
        biz: 456,
        someGeneralStudyLog: true,
      },
    }

    const response = await request(app.getHttpServer())
      .post(
        `/interaction-logs/study-participation/${validStudyParticipationDto.id}`,
      )
      .send(dto)
      .expect(HttpStatusCode.Created)

    expect(response.body).toHaveProperty('_id')

    const result = await interactionLogsModel.findById(response.body._id)

    expect(result).toBeDefined()
    expect(plainToInstance(InteractionLogCreateDto, result)).toEqual(dto)
    expect(result?.assignmentCompletionId).not.toBeDefined()
    // Study ID is stored as an ObjectId, so we need to convert it to a string
    expect(result?.studyParticipationId?.toString()).toEqual(
      validStudyParticipationDto.id,
    )
  })

  it("should return a 400 Bad Request when the ID isn't a mongo ID", async () => {
    mockAuthGuard.setCurrentUser(studentUser)

    const dto: InteractionLogCreateDto = {
      payload: {
        biz: 456,
        someGeneralStudyLog: true,
      },
    }

    await request(app.getHttpServer())
      .post(`/interaction-logs/study-participation/not-a-mongo-id`)
      .send(dto)
      .expect(HttpStatusCode.BadRequest)
  })

  it('should create a log when a study is created', async () => {
    const participationId = Types.ObjectId.createFromTime(123)

    const currentLogsCount = await interactionLogsModel
      .count({
        studyParticipationId: participationId,
      })
      .exec()
    expect(currentLogsCount).toBe(0)

    const creationDate = new Date()
    eventEmitter.emit(studyParticipationCreatedEventToken, {
      time: creationDate,
      userId: mathmagicianStudentUser.id,
      studyParticipationId: participationId,
    } satisfies StudyParticipationCreatedEventPayload)

    const newLogs = await interactionLogsModel
      .find({
        studyParticipationId: participationId,
      })
      .exec()
    expect(newLogs).toHaveLength(1)
    expect(newLogs[0].datetime).toEqual(creationDate)
    expect(newLogs[0].userId).toEqual(mathmagicianStudentUser.id)
    expect(newLogs[0].studyParticipationId).toEqual(participationId)
    expect(newLogs[0].assignmentCompletionId).not.toBeDefined()
    expect(newLogs[0].payload).toEqual({
      action: 'participation-created',
    })
  })

  describe('when assignment completed event is fired', () => {
    const baseAssignmentCompletion = {
      assignmentId: GuessRandomNumberAssignment.id,
      config: {},
      completionData: {
        progress: 1,
      },
      userId: mathmagicianStudentUser.id,
      isForStudy: true,
      createdAt: new Date(),
      lastUpdated: new Date(),
    } satisfies Partial<AssignmentCompletion>

    const countLogsForAssignmentCompletion = async (
      assignmentCompletionId: Types.ObjectId,
    ) =>
      await interactionLogsModel
        .count({
          assignmentCompletionId,
        })
        .exec()

    const countLogsForStudyParticipation = async (
      studyParticipationId: Types.ObjectId,
    ) =>
      await interactionLogsModel
        .count({
          studyParticipationId,
        })
        .exec()

    it("should NOT create a log when completion doesn't belong to study participation", async () => {
      const getParticipationForAssignmentCompletionSpy =
        studyParticipationBackendService.getParticipationForAssignmentCompletion as unknown as jest.SpyInstance
      getParticipationForAssignmentCompletionSpy.mockResolvedValue(null)

      const assignmentCompletionId = Types.ObjectId.createFromTime(1234)

      expect(
        await countLogsForAssignmentCompletion(assignmentCompletionId),
      ).toBe(0)

      const creationDate = new Date()
      eventEmitter.emit(assignmentCompletedEventToken, {
        time: creationDate,
        userId: mathmagicianStudentUser.id,
        assignmentCompletionId: assignmentCompletionId,
      } satisfies AssignmentCompletedEventPayload)

      const newLogsCount = await interactionLogsModel
        .count({
          assignmentCompletionId: assignmentCompletionId,
        })
        .exec()
      expect(newLogsCount).toBe(0)
    })

    it('should create a COMPLETED log when entire participation is completed', async () => {
      const getParticipationForAssignmentCompletionSpy =
        studyParticipationBackendService.getParticipationForAssignmentCompletion as unknown as jest.SpyInstance
      const participationId = Types.ObjectId.createFromTime(234)
      const assignmentCompletionId = Types.ObjectId.createFromTime(2345256)

      getParticipationForAssignmentCompletionSpy.mockResolvedValue({
        _id: participationId,
        assignmentCompletionIds: [
          {
            ...baseAssignmentCompletion,
            _id: assignmentCompletionId,
            completionData: {
              progress: 1,
            },
          } satisfies AssignmentCompletion & { _id: Types.ObjectId },
        ],
      })

      expect(
        await countLogsForAssignmentCompletion(assignmentCompletionId),
      ).toBe(0)
      expect(await countLogsForStudyParticipation(participationId)).toBe(0)

      const creationDate = new Date()
      eventEmitter.emit(assignmentCompletedEventToken, {
        time: creationDate,
        userId: mathmagicianStudentUser.id,
        assignmentCompletionId: assignmentCompletionId,
      } satisfies AssignmentCompletedEventPayload)

      expect(
        await countLogsForAssignmentCompletion(assignmentCompletionId),
      ).toBe(0)
      const newLogs = await interactionLogsModel
        .find({
          studyParticipationId: participationId,
        })
        .exec()
      expect(newLogs).toHaveLength(1)
      expect(newLogs[0].datetime).toEqual(creationDate)
      expect(newLogs[0].userId).toEqual(mathmagicianStudentUser.id)
      expect(newLogs[0].studyParticipationId).toEqual(participationId)
      expect(newLogs[0].assignmentCompletionId).not.toBeDefined()
      expect(newLogs[0].payload).toEqual({
        action: 'participation-completed',
      })
    })

    it('should create a "assignment completed" log when other assignments are still missing completed', async () => {
      const getParticipationForAssignmentCompletionSpy =
        studyParticipationBackendService.getParticipationForAssignmentCompletion as unknown as jest.SpyInstance
      const participationId = Types.ObjectId.createFromTime(3567456)
      const assignmentCompletionId = Types.ObjectId.createFromTime(89743295)

      getParticipationForAssignmentCompletionSpy.mockResolvedValue({
        _id: participationId,
        assignmentCompletionIds: [
          {
            ...baseAssignmentCompletion,
            _id: assignmentCompletionId,
            completionData: {
              progress: 1,
            },
          },
          {
            ...baseAssignmentCompletion,
            _id: Types.ObjectId.createFromTime(97879),
            completionData: {
              progress: 0,
            },
          },
        ] satisfies Array<AssignmentCompletion & { _id: Types.ObjectId }>,
      })

      expect(
        await countLogsForAssignmentCompletion(assignmentCompletionId),
      ).toBe(0)
      expect(await countLogsForStudyParticipation(participationId)).toBe(0)

      const creationDate = new Date()
      eventEmitter.emit(assignmentCompletedEventToken, {
        time: creationDate,
        userId: mathmagicianStudentUser.id,
        assignmentCompletionId: assignmentCompletionId,
      } satisfies AssignmentCompletedEventPayload)

      expect(await countLogsForStudyParticipation(participationId)).toBe(0)
      const newLogs = await interactionLogsModel
        .find({
          assignmentCompletionId,
        })
        .exec()
      expect(newLogs).toHaveLength(1)
      expect(newLogs[0].datetime).toEqual(creationDate)
      expect(newLogs[0].userId).toEqual(mathmagicianStudentUser.id)
      expect(newLogs[0].studyParticipationId).not.toBeDefined()
      expect(newLogs[0].assignmentCompletionId).toEqual(assignmentCompletionId)
      expect(newLogs[0].payload).toEqual({
        action: 'assignment-completed',
      })
    })
  })
})
