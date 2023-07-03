import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { KeycloakTokenParsed } from 'keycloak-js'
import { extractRequest } from 'nest-keycloak-connect/util'
import { parseUser } from '@stochus/auth/shared'

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
