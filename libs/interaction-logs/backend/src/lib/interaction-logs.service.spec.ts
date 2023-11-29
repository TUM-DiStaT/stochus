import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection, Model, connect } from 'mongoose'
import { guessRandomNumberJustStartedCompletionDto } from '@stochus/assignment/core/shared'
import { studentUser } from '@stochus/auth/shared'
import { StudyParticipationBackendService } from '@stochus/studies/backend'
import { InteractionLogCreateDto } from '@stochus/interaction-logs/dtos'
import { InteractionLog, InteractionLogSchema } from './interaction-logs.schema'
import { InteractionLogsService } from './interaction-logs.service'

describe('InteractionLogsService', () => {
  let service: InteractionLogsService
  let mongod: MongoMemoryServer
  let mongoConnection: Connection
  let logsModel: Model<InteractionLog>

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    mongoConnection = (await connect(mongod.getUri())).connection
    logsModel = mongoConnection.model(InteractionLog.name, InteractionLogSchema)
  })

  afterAll(async () => {
    await mongoConnection.dropDatabase()
    await mongoConnection.close()
    await mongod.stop()
  })

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        InteractionLogsService,
        {
          provide: getModelToken(InteractionLog.name),
          useValue: logsModel,
        },
        {
          provide: StudyParticipationBackendService,
          useValue: {
            assertCompletionIsPartOfActiveStudy: () => Promise.resolve(),
          },
        },
      ],
    }).compile()

    service = module.get(InteractionLogsService)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })

  it('should correctly create an interaction log with appropriate default values', async () => {
    // given
    const dto: InteractionLogCreateDto = {
      assignmentCompletionId: guessRandomNumberJustStartedCompletionDto.id,
      payload: {
        foo: 'bar',
      },
    }

    // when
    await service.createNewLogEntry(
      dto,
      studentUser,
      guessRandomNumberJustStartedCompletionDto.id,
    )

    // then
    const allLogs = await logsModel.find().exec()
    expect(allLogs).toHaveLength(1)
    const log = allLogs[0]
    expect(log.payload).toEqual(dto.payload)
    // accept up to 0.999-second difference
    expect(log.datetime.valueOf()).toBeCloseTo(new Date().valueOf(), -3)
    expect(log.userId).toBe(studentUser.id)
  })
})
