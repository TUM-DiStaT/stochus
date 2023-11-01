import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { HttpStatusCode } from 'axios'
import { instanceToPlain } from 'class-transformer'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection, Types, connect } from 'mongoose'
import * as request from 'supertest'
import { researcherUserReggie, studentUser } from '@stochus/auth/shared'
import { StudyDto, validStudyCreateDto } from '@stochus/studies/shared'
import {
  KeycloakAdminModule,
  KeycloakAdminService,
  MockAuthGuard,
  MockRoleGuard,
} from '@stochus/auth/backend'
import { StudiesBackendController } from './studies-backend.controller'
import { StudiesBackendService } from './studies-backend.service'
import { Study, StudySchema } from './study.schema'

describe('Studies', () => {
  let app: INestApplication

  let mongod: MongoMemoryServer
  let mongoConnection: Connection

  let mockAuthGuard: MockAuthGuard

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    mongoConnection = (await connect(mongod.getUri())).connection

    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri()),
        MongooseModule.forFeature([
          {
            name: Study.name,
            schema: StudySchema,
          },
        ]),
        KeycloakAdminModule,
      ],
      providers: [StudiesBackendService],
      controllers: [StudiesBackendController],
    })
      .overrideProvider(KeycloakAdminService)
      .useValue({})
      .compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        transformOptions: {
          excludeExtraneousValues: true,
        },
        transform: true,
      }),
    )
    mockAuthGuard = new MockAuthGuard()
    app.useGlobalGuards(mockAuthGuard)
    app.useGlobalGuards(new MockRoleGuard(await app.resolve(Reflector)))

    await app.init()
  })

  afterAll(async () => {
    await app.close()

    await mongoConnection.dropDatabase()
    await mongoConnection.close()
    await mongod.stop()
  })

  it('should not allow a student to create a study', async () => {
    mockAuthGuard.setCurrentUser(studentUser)

    await request(app.getHttpServer())
      .post('/studies/manage/')
      .send(validStudyCreateDto)
      .expect(HttpStatusCode.Forbidden)
  })

  it('should not allow a student to get their studies', async () => {
    mockAuthGuard.setCurrentUser(studentUser)

    await request(app.getHttpServer())
      .get('/studies/manage/')
      .send()
      .expect(HttpStatusCode.Forbidden)
  })

  it('should not allow an invalid study to be created', async () => {
    mockAuthGuard.setCurrentUser(researcherUserReggie)

    await request(app.getHttpServer())
      .post('/studies/manage/')
      .send({
        ...validStudyCreateDto,
        name: undefined,
      })
      .expect(HttpStatusCode.BadRequest)
  })

  it('should strip extraneous properties from study and config', async () => {
    mockAuthGuard.setCurrentUser(researcherUserReggie)

    const response = await request(app.getHttpServer())
      .post('/studies/manage/')
      .send({
        ...validStudyCreateDto,
        somethingRandom: 'foobar',
        tasks: [
          {
            ...validStudyCreateDto.tasks[0],
            anotherExtraProp: 1234,
            config: {
              ...(validStudyCreateDto.tasks[0].config as object),
              yetAnotherOne: 'asdfqwer',
            },
          },
        ],
      })
      .expect(HttpStatusCode.Created)

    expect(response.body).toHaveProperty('id')
    const id = response.body.id
    const collections = await mongoConnection.db.listCollections().toArray()
    expect(collections).toHaveLength(1)
    const studiesCollection = mongoConnection.collection(collections[0].name)
    const studyFromDb = await studiesCollection.findOne({
      _id: new Types.ObjectId(id),
    })

    expect(studyFromDb).toEqual({
      // This, most importantly, may not include the properties
      // we previously added by hand!
      ...instanceToPlain(validStudyCreateDto),
      __v: expect.anything(),
      _id: expect.anything(),
      ownerId: researcherUserReggie.id,
    })
  })

  it('should not allow a student to delete a study but owner should be allowed to', async () => {
    mockAuthGuard.setCurrentUser(researcherUserReggie)
    const response = await request(app.getHttpServer())
      .post('/studies/manage/')
      .send(validStudyCreateDto)
      .expect(HttpStatusCode.Created)
    const study = response.body as StudyDto

    mockAuthGuard.setCurrentUser(studentUser)
    await request(app.getHttpServer())
      .delete(`/studies/manage/${study.id}`)
      .send()
      .expect(HttpStatusCode.Forbidden)

    mockAuthGuard.setCurrentUser(researcherUserReggie)
    await request(app.getHttpServer())
      .delete(`/studies/manage/${study.id}`)
      .send()
      .expect(HttpStatusCode.Ok)
  })

  it('should throw an error if the ID is not a valid mongo ID', async () => {
    mockAuthGuard.setCurrentUser(researcherUserReggie)

    await request(app.getHttpServer())
      .delete(`/studies/manage/not-a-mongo-id`)
      .send()
      .expect(HttpStatusCode.BadRequest)
  })
})
