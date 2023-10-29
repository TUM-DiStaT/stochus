import { KeycloakTokenParsed } from 'keycloak-js'
import { UserRoles, isValidRoles } from './UserRoles'

export type User = {
  id: string
  username: string
  firstName?: string
  lastName?: string
  email?: string
  roles: UserRoles[]
  groups: string[]
}

const undefinedIfEmpty = (str?: string): string | undefined =>
  str ? str : undefined

export const parseUser = (unparsedUser: KeycloakTokenParsed): User => {
  const roles = unparsedUser.realm_access?.roles
  const groups: string[] = unparsedUser['groups'] ?? []

  if (!unparsedUser.sub || !roles || !isValidRoles(roles)) {
    throw new Error('Invalid JWT data')
  }

  return {
    id: unparsedUser.sub,
    roles: roles,
    username: unparsedUser['preferred_username'],
    email: undefinedIfEmpty(unparsedUser['email']),
    firstName: undefinedIfEmpty(unparsedUser['given_name']),
    lastName: undefinedIfEmpty(unparsedUser['family_name']),
    groups,
  }
}

export const userToKeycloakTokenParsed = (user: User): KeycloakTokenParsed => {
  return {
    sub: user.id,
    preferred_username: user.username,
    email: user.email,
    given_name: user.firstName,
    family_name: user.lastName,
    realm_access: {
      roles: user.roles,
    },
    groups: user.groups,
  }
}
