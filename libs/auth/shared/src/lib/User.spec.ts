import { User, parseUser, userToKeycloakTokenParsed } from './User'
import { researcherUser, studentUser } from './user.fixture'

describe('userToKeycloakTokenParsed', () => {
  it.each([studentUser, researcherUser])(
    'should convert %p to a keycloakTokenParsed and back again',
    (user: User) => {
      expect(parseUser(userToKeycloakTokenParsed(user))).toEqual(user)
    },
  )
})
