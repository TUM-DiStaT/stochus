import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { instanceToPlain } from 'class-transformer'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection, Model, connect } from 'mongoose'
import { GuessRandomNumberAssignment } from '@stochus/assignments/demos/guess-random-number/shared'
import {
  researcherUserRaymond,
  researcherUserReggie,
} from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import {
  StudyCreateDto,
  StudyDto,
  validStudyCreateDto,
} from '@stochus/studies/shared'
import { StudiesBackendService } from './studies-backend.service'
import { Study, StudySchema } from './study.schema'

describe('StudiesBackendService', () => {
  let service: StudiesBackendService
  let mongod: MongoMemoryServer
  let mongoConnection: Connection
  let studiesModel: Model<Study>

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    mongoConnection = (await connect(mongod.getUri())).connection
    studiesModel = mongoConnection.model(Study.name, StudySchema)
  })

  afterAll(async () => {
    await mongoConnection.dropDatabase()
    await mongoConnection.close()
    await mongod.stop()
  })

  beforeEach(async () => {
    await studiesModel.deleteMany().exec()

    const module = await Test.createTestingModule({
      providers: [
        StudiesBackendService,
        {
          provide: getModelToken(Study.name),
          useValue: studiesModel,
        },
      ],
    }).compile()

    service = module.get(StudiesBackendService)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })

  describe('create', () => {
    it('should correctly create a study, adding the appropriate owner and an ID', async () => {
      await expect(
        service.create(validStudyCreateDto, researcherUserReggie),
      ).resolves.toEqual(
        expect.objectContaining({
          ...instanceToPlain(validStudyCreateDto),
          ownerId: researcherUserReggie.id,
          id: expect.stringMatching(/.+/),
        }),
      )
    })

    it("should throw an error if a task's assignment doesn't exist", async () => {
      const dto: StudyCreateDto = {
        ...validStudyCreateDto,
        tasks: [
          {
            assignmentId: GuessRandomNumberAssignment.id + 'some random shit',
            config: {},
            assignmentVersion: 1,
          },
        ],
      }

      await expect(
        service.create(dto, researcherUserReggie),
      ).rejects.toBeDefined()
    })

    it("should throw an error if a task's config isn't valid", async () => {
      const dto: StudyCreateDto = {
        ...validStudyCreateDto,
        tasks: [
          {
            assignmentId: GuessRandomNumberAssignment.id,
            config: {},
            assignmentVersion: 1,
          },
        ],
      }

      await expect(
        service.create(dto, researcherUserReggie),
      ).rejects.toBeDefined()
    })
  })

  describe('getAllByOwner', () => {
    it('should return [] when owner has no studies', async () => {
      await expect(
        service.getAllByOwner(researcherUserReggie),
      ).resolves.toEqual([])
    })

    it('should return study when it is owned by owner', async () => {
      const fromCreate = await service.create(
        validStudyCreateDto,
        researcherUserReggie,
      )

      // Create dto for other user for distraction
      await service.create(validStudyCreateDto, researcherUserRaymond)

      const fromGetAll = await service.getAllByOwner(researcherUserReggie)

      expect(plainToInstance(StudyDto, fromGetAll)).toEqual(
        plainToInstance(StudyDto, [fromCreate]),
      )
    })
  })
})