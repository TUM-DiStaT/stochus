import { Test } from '@nestjs/testing'
import { InteractionLogsService } from './interaction-logs.service'
import { getModelToken } from '@nestjs/mongoose'
import { InteractionLog, InteractionLogSchema } from './interaction-logs.schema'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, Connection, Model } from 'mongoose'
import { InteractionLogCreateDto } from '@stochus/interaction-logs/dtos'
import { studentUser } from '@stochus/auth/shared'

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
      payload: {
        foo: 'bar',
      },
    }

    // when
    await service.createNewLogEntry(dto, studentUser)

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
