import { isValidRoles, UserRoles } from './UserRoles'

describe('isValidRoles', () => {
  it('should return true for an empty array', () => {
    expect(isValidRoles([])).toBe(true)
  })

  it('should return true for some role that exists', () => {
    expect(isValidRoles([UserRoles.DEFAULT_ROLES_STOCHUS])).toBe(true)
  })

  it('should return false for the enum name of a role', () => {
    expect(isValidRoles(['DEFAULT_ROLES_STOCHUS'])).toBe(false)
  })

  it('should return true for the values of the roles enum', () => {
    expect(isValidRoles(Object.values(UserRoles))).toBe(true)
  })

  it("should return false if there is a role that doesn't exist in the roles enum", () => {
    expect(
      isValidRoles(['some weird role that will NEVER exist!#$*&@^#']),
    ).toBe(false)
  })
})
