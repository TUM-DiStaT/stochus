import { NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection, Model, connect } from 'mongoose'
import { AssignmentCompletionDto } from '@stochus/assignment/core/shared'
import {
  GuessRandomNumberAssignment,
  GuessRandomNumberAssignmentConfiguration,
} from '@stochus/assignments/demos/guess-random-number/shared'
import { studentUser } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import {
  AssignmentCompletion,
  AssignmentCompletionSchema,
} from './completion.schema'
import { CompletionsService } from './completions.service'

describe('CompletionsService', () => {
  let service: CompletionsService
  let mongod: MongoMemoryServer
  let mongoConnection: Connection
  let completionsModel: Model<AssignmentCompletion>

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    mongoConnection = (await connect(mongod.getUri())).connection
    completionsModel = mongoConnection.model(
      AssignmentCompletion.name,
      AssignmentCompletionSchema,
    )
  })

  afterAll(async () => {
    await mongoConnection.dropDatabase()
    await mongoConnection.close()
    await mongod.stop()
  })

  beforeEach(async () => {
    await completionsModel.deleteMany().exec()

    const module = await Test.createTestingModule({
      providers: [
        CompletionsService,
        {
          provide: getModelToken(AssignmentCompletion.name),
          useValue: completionsModel,
        },
      ],
    }).compile()

    service = module.get(CompletionsService)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })

  describe('create completion for assignment id', () => {
    it('should throw an error if the assignment ID is not known', async () => {
      await expect(() =>
        service.createForAssignment('SOME UNKNOWN ID, yo', studentUser),
      ).rejects.toThrow(NotFoundException)
    })

    it('should create a new config if none is provided', async () => {
      const completion = await service.createForAssignment(
        GuessRandomNumberAssignment.id,
        studentUser,
      )
      expect(completion.config).toBeDefined()
    })

    it('should create a new progress object', async () => {
      const completion = await service.createForAssignment(
        GuessRandomNumberAssignment.id,
        studentUser,
      )
      expect(completion.completionData).toBeDefined()
    })

    it("should assign the current user's ID", async () => {
      const completion = await service.createForAssignment(
        GuessRandomNumberAssignment.id,
        studentUser,
      )
      expect(completion.userId).toEqual(studentUser.id)
    })

    it("should use the config if it's provided", async () => {
      const config: GuessRandomNumberAssignmentConfiguration = {
        result: 42,
      }

      const completion = await service.createForAssignment(
        GuessRandomNumberAssignment.id,
        studentUser,
        config,
      )

      expect(completion.config).toEqual(config)
    })

    it('should persist the config', async () => {
      const fromCreate = await service.createForAssignment(
        GuessRandomNumberAssignment.id,
        studentUser,
      )
      const fromGet = await service.getById(fromCreate.id)
      expect(plainToInstance(AssignmentCompletionDto, fromGet)).toEqual(
        plainToInstance(AssignmentCompletionDto, fromCreate),
      )
    })

    it('should throw an error if the user already has a running completion', async () => {
      await service.createForAssignment(
        GuessRandomNumberAssignment.id,
        studentUser,
      )
      await expect(() =>
        service.createForAssignment(
          GuessRandomNumberAssignment.id,
          studentUser,
        ),
      ).rejects.toThrow()
    })

    it('should pass if the user already has a finished completion', async () => {
      const originalCompletion = await service.createForAssignment(
        GuessRandomNumberAssignment.id,
        studentUser,
      )
      await completionsModel
        .updateOne(
          {
            userId: studentUser.id,
          },
          {
            'completionData.progress': 1,
          },
        )
        .exec()

      const newCompletion = await service.createForAssignment(
        GuessRandomNumberAssignment.id,
        studentUser,
      )

      expect(newCompletion.id).not.toEqual(originalCompletion.id)
    })
  })
})
