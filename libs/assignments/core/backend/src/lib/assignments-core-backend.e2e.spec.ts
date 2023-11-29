import { INestApplication } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { HttpStatusCode } from 'axios'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Connection, connect } from 'mongoose'
import { AuthGuard, RoleGuard } from 'nest-keycloak-connect'
import * as request from 'supertest'
import { AssignmentCompletionDto } from '@stochus/assignment/core/shared'
import { GuessRandomNumberAssignment } from '@stochus/assignments/demos/guess-random-number/shared'
import { studentUser } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { MockAuthGuard, MockRoleGuard } from '@stochus/auth/backend'
import { registerGlobalUtilitiesToApp } from '@stochus/core/backend'
import { AssignmentsCoreBackendModule } from './assignments-core-backend.module'

describe('Assignments', () => {
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
        AssignmentsCoreBackendModule,
      ],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .overrideGuard(RoleGuard)
      .useClass(MockRoleGuard)
      .compile()

    app = moduleRef.createNestApplication()
    registerGlobalUtilitiesToApp(app)

    mockAuthGuard = await app.resolve(AuthGuard)

    await app.init()
  })

  afterAll(async () => {
    await app.close()

    await mongoConnection.dropDatabase()
    await mongoConnection.close()
    await mongod.stop()
  })

  describe('Completions', () => {
    it("should return not authorized when getting active completion and user isn' logged in", async () => {
      mockAuthGuard.setCurrentUser(undefined)

      await request(app.getHttpServer())
        .get(
          `/assignments/completions/${GuessRandomNumberAssignment.id}/active`,
        )
        .send()
        .expect(HttpStatusCode.Unauthorized)
    })

    it('should return 404 if no completion exists', async () => {
      mockAuthGuard.setCurrentUser({
        ...studentUser,
        id: 'no-completion-user',
      })

      await request(app.getHttpServer())
        .get(
          `/assignments/completions/${GuessRandomNumberAssignment.id}/active`,
        )
        .send()
        .expect(HttpStatusCode.NotFound)
    })

    it('should correctly create and retrieve a completion', async () => {
      mockAuthGuard.setCurrentUser({
        ...studentUser,
        id: 'creation-test-user',
      })

      const { body: created } = await request(app.getHttpServer())
        .post(`/assignments/completions/${GuessRandomNumberAssignment.id}`)
        .send()
        .expect(HttpStatusCode.Created)

      const { body: requested } = await request(app.getHttpServer())
        .get(
          `/assignments/completions/${GuessRandomNumberAssignment.id}/active`,
        )
        .send()
        .expect(HttpStatusCode.Ok)

      expect(
        plainToInstance(AssignmentCompletionDto, created),
      ).toMatchInlineSnapshot(
        {
          id: expect.any(String),
          createdAt: expect.any(Date),
          lastUpdated: expect.any(Date),
          config: {
            result: expect.any(Number),
          },
        },
        `
        {
          "assignmentId": "GuessRandomNumberAssignment",
          "completionData": {
            "guesses": [],
            "progress": 0,
          },
          "config": {
            "result": Any<Number>,
          },
          "createdAt": Any<Date>,
          "id": Any<String>,
          "isForStudy": false,
          "lastUpdated": Any<Date>,
        }
      `,
      )
      expect(requested).toEqual(created)
    })
  })
})
