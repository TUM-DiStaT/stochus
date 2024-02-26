import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { AppConfigurationService } from './app-configuration.service'

import SpyInstance = jest.SpyInstance

const expectedConfigKeys = [
  'MONGO_DB_URI',
  'MONGO_DB_USERNAME',
  'MONGO_DB_PASSWORD',
  'MONGO_DB_DB_NAME',
  'KEYCLOAK_REALM',
  'KEYCLOAK_ORIGIN',
  'KEYCLOAK_BACKEND_CLIENT_ID',
  'KEYCLOAK_BACKEND_CLIENT_SECRET',
] as const

describe('AppConfigurationService', () => {
  let configurationService: ConfigService
  let getOrThrowMock: SpyInstance

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile()

    configurationService = module.get(ConfigService)

    getOrThrowMock = jest.spyOn(configurationService, 'getOrThrow')
  })

  it('should create successfully if all keys exist', () => {
    getOrThrowMock.mockImplementation((key) => {
      if (!expectedConfigKeys.includes(key)) {
        throw new Error(`Unknown key ${key} queried`)
      }
      return ''
    })

    expect(() => {
      new AppConfigurationService(configurationService)
    }).not.toThrow()
  })

  it.each(expectedConfigKeys)(
    "should fail if %p doesn't exist",
    (inexistentKey) => {
      getOrThrowMock.mockImplementation((key) => {
        if (key === inexistentKey) {
          throw new Error(`Unknown key ${key} queried`)
        }
        return ''
      })

      expect(() => {
        new AppConfigurationService(configurationService)
      }).toThrow()
    },
  )
})
