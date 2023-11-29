import { NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { validateOrReject } from 'class-validator'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection, Model, connect } from 'mongoose'
import { AssignmentCompletionDto } from '@stochus/assignment/core/shared'
import {
  GuessRandomNumberAssignment,
  GuessRandomNumberAssignmentCompletionData,
  GuessRandomNumberAssignmentConfiguration,
} from '@stochus/assignments/demos/guess-random-number/shared'
import { BaseCompletionData } from '@stochus/assignments/model/shared'
import { researcherUserReggie, studentUser } from '@stochus/auth/shared'
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
        service.create('SOME UNKNOWN ID, yo', studentUser),
      ).rejects.toThrow(NotFoundException)
    })

    it('should create a new config if none is provided', async () => {
      const completion = await service.create(
        GuessRandomNumberAssignment.id,
        studentUser,
      )
      expect(completion.config).toBeDefined()
    })

    it('should create a new progress object', async () => {
      const completion = await service.create(
        GuessRandomNumberAssignment.id,
        studentUser,
      )
      expect(completion.completionData).toBeDefined()
    })

    it("should assign the current user's ID", async () => {
      const completion = await service.create(
        GuessRandomNumberAssignment.id,
        studentUser,
      )
      expect(completion.userId).toEqual(studentUser.id)
    })

    it("should use the config if it's provided", async () => {
      const config: GuessRandomNumberAssignmentConfiguration = {
        result: 42,
      }

      const completion = await service.create(
        GuessRandomNumberAssignment.id,
        studentUser,
        config,
      )

      expect(completion.config).toEqual(config)
    })

    it('should persist the config', async () => {
      const fromCreate = await service.create(
        GuessRandomNumberAssignment.id,
        studentUser,
      )
      const fromGet = await service.getById(fromCreate.id)
      expect(plainToInstance(AssignmentCompletionDto, fromGet)).toEqual(
        plainToInstance(AssignmentCompletionDto, fromCreate),
      )
    })

    it('should throw an error if the user already has a running completion', async () => {
      await service.create(GuessRandomNumberAssignment.id, studentUser)
      await expect(() =>
        service.create(GuessRandomNumberAssignment.id, studentUser),
      ).rejects.toThrow()
    })

    it('should pass if the user already has a finished completion', async () => {
      const originalCompletion = await service.create(
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

      const newCompletion = await service.create(
        GuessRandomNumberAssignment.id,
        studentUser,
      )

      expect(newCompletion.id).not.toEqual(originalCompletion.id)
    })
  })

  describe('get active completions for user', () => {
    it('should return an empty list if user has no active completions', async () => {
      const user = studentUser
      const completion = await service.create(
        GuessRandomNumberAssignment.id,
        user,
      )
      await completionsModel.updateOne(
        {
          _id: completion.id,
        },
        {
          completionData: {
            progress: 1,
          },
        } satisfies Partial<AssignmentCompletion>,
      )

      const allActive = await service.getAllActive(user)

      expect(allActive).toHaveLength(0)
    })

    it("should return only the given user's active completions", async () => {
      const user = studentUser
      await service.create(GuessRandomNumberAssignment.id, user)
      await service.create(GuessRandomNumberAssignment.id, researcherUserReggie)

      const allActive = await service.getAllActive(user)

      expect(allActive).toHaveLength(1)
    })
  })

  describe('update completion', () => {
    it("should throw an error if the ID doesn't belong to the user", async () => {
      const completion = await service.create(
        GuessRandomNumberAssignment.id,
        studentUser,
      )

      await expect(() =>
        service.updateCompletionData(completion.id, researcherUserReggie, {}),
      ).rejects.toThrowError()
    })

    it("should throw an error if the new data isn't valid", async () => {
      const completion = await service.create(
        GuessRandomNumberAssignment.id,
        studentUser,
      )

      // Sanity check
      const update = {
        guesses: 123,
      }
      const updated = plainToInstance(
        GuessRandomNumberAssignment.completionDataClass,
        {
          ...completion.completionData,
          ...update,
        },
      )
      await expect(validateOrReject(updated)).rejects.toBeDefined()

      await expect(() =>
        service.updateCompletionData(
          completion.id,
          studentUser,
          update as Partial<BaseCompletionData>,
        ),
      ).rejects.toThrowError()
    })

    it('should correctly update the data', async () => {
      const completion = await service.create(
        GuessRandomNumberAssignment.id,
        studentUser,
      )
      const newGuesses = [1, 3, 5]
      const updated = await service.updateCompletionData(
        completion.id,
        studentUser,
        {
          guesses: newGuesses,
        } as Partial<GuessRandomNumberAssignmentCompletionData>,
      )
      expect(
        (updated?.completionData as GuessRandomNumberAssignmentCompletionData)
          .guesses,
      ).toEqual(newGuesses)
    })
  })
})
