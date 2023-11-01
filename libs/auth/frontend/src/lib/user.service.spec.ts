import { TestBed } from '@angular/core/testing'
import { KeycloakService } from 'keycloak-angular'
import Keycloak from 'keycloak-js'
import { KeycloakTestingModule } from './KeycloakTestingModule'
import { UserService } from './user.service'

describe('UserService', () => {
  let service: UserService
  const mockKeycloakInstance: Keycloak = {} as unknown as Keycloak

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KeycloakTestingModule],
    })
    service = TestBed.inject(UserService)

    const keycloakService = TestBed.inject(KeycloakService)
    jest
      .spyOn(keycloakService, 'getKeycloakInstance')
      .mockReturnValue(mockKeycloakInstance)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('getUser', () => {
    it('should return undefined if token is undefined', () => {
      // given
      mockKeycloakInstance.tokenParsed = undefined

      // when
      const result = service.getUser()

      // then
      expect(result).toBe(undefined)
    })

    it('should correctly map the user if the token has content', () => {
      // given
      mockKeycloakInstance.tokenParsed = {
        exp: 1680885449,
        iat: 1680885149,
        auth_time: 1680884280,
        jti: 'eb646224-8124-4df2-81ac-4a300d586626',
        iss: 'http://localhost:8080/realms/stochus',
        aud: 'account',
        sub: '07b3fa7d-7301-4cf9-bc5a-8e190f0960ba',
        typ: 'Bearer',
        azp: 'stochus-frontend',
        nonce: '4ebfdab1-0b29-4d5f-8537-8ffe2052b7a5',
        session_state: '44aeebb5-5a1e-40fe-9fc9-05571a0284da',
        acr: '0',
        'allowed-origins': ['http://localhost:4200'],
        realm_access: {
          roles: [
            'offline_access',
            'uma_authorization',
            'default-roles-stochus',
          ],
        },
        resource_access: {
          account: {
            roles: ['manage-account', 'manage-account-links', 'view-profile'],
          },
        },
        scope: 'openid profile email',
        sid: '44aeebb5-5a1e-40fe-9fc9-05571a0284da',
        email_verified: true,
        preferred_username: 'john.doe',
        given_name: '',
        family_name: '',
        email: 'john.doe@example.com',
      }

      // when
      const result = service.getUser()

      // then
      expect(result).toMatchInlineSnapshot(`
        {
          "email": "john.doe@example.com",
          "firstName": undefined,
          "groups": [],
          "id": "07b3fa7d-7301-4cf9-bc5a-8e190f0960ba",
          "lastName": undefined,
          "roles": [
            "offline_access",
            "uma_authorization",
            "default-roles-stochus",
          ],
          "username": "john.doe",
        }
      `)
    })
  })
})
