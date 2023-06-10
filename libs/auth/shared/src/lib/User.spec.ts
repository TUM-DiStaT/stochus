import { researcherUser, studentUser } from './user.fixture'
import { parseUser, User, userToKeycloakTokenParsed } from './User'

describe('userToKeycloakTokenParsed', () => {
  it.each([studentUser, researcherUser])(
    'should convert %p to a keycloakTokenParsed and back again',
    (user: User) => {
      expect(parseUser(userToKeycloakTokenParsed(user))).toEqual(user)
    },
  )
})
