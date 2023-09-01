import { User, parseUser, userToKeycloakTokenParsed } from './User'
import { researcherUserReggie, studentUser } from './user.fixture'

describe('userToKeycloakTokenParsed', () => {
  it.each([studentUser, researcherUserReggie])(
    'should convert %p to a keycloakTokenParsed and back again',
    (user: User) => {
      expect(parseUser(userToKeycloakTokenParsed(user))).toEqual(user)
    },
  )
})
