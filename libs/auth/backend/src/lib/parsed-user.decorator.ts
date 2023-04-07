import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common'
import { extractRequest } from 'nest-keycloak-connect/util'
import { KeycloakTokenParsed } from 'keycloak-js'
import { isValidRoles, User } from '@stochus/auth/shared'

const undefinedIfEmpty = (str?: string): string | undefined =>
  str ? str : undefined

const parseUser = (unparsedUser: KeycloakTokenParsed): User => {
  const roles = unparsedUser.realm_access?.roles

  if (!unparsedUser.sub || !roles || !isValidRoles(roles)) {
    throw new InternalServerErrorException()
  }

  return {
    id: unparsedUser.sub,
    roles: roles,
    username: unparsedUser['preferred_username'],
    email: undefinedIfEmpty(unparsedUser['email']),
    firstName: undefinedIfEmpty(unparsedUser['given_name']),
    lastName: undefinedIfEmpty(unparsedUser['family_name']),
  }
}

export const ParsedUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const [request] = extractRequest(context)
    const unparsedUser: KeycloakTokenParsed | undefined = request.user

    if (!unparsedUser) {
      throw new Error(
        'ParsedUser was used without the user having been parsed by Keycloak. Perhaps the route is set to @Public()?',
      )
    }

    return unparsedUser ? parseUser(unparsedUser) : undefined
  },
)
