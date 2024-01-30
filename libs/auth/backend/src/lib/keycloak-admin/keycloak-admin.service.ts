// import type KeycloakAdminClient from '@keycloak/keycloak-admin-client'
import KeycloakAdminClient from '@keycloak/keycloak-admin-client'
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { Issuer, TokenSet } from 'openid-client'
import { User } from '@stochus/auth/shared'
import { plainToInstance } from '@stochus/core/shared'
import { keycloakUrl, realm } from '../keycloak-config'
import { StudentMetadata } from './student-metadata'

@Injectable()
export class KeycloakAdminService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger(KeycloakAdminService.name)
  private tokenRefreshInterval?: NodeJS.Timer
  private keycloakAdminClient = new KeycloakAdminClient({
    baseUrl: keycloakUrl,
    realmName: realm,
  })

  async getGroups() {
    this.logger.verbose('fetching groups!')
    return await this.keycloakAdminClient.groups.find()
  }

  async getGroupsForUser(user: User) {
    const allGroups = await this.getGroups()
    return allGroups.filter(
      (g) => g.path !== undefined && user.groups.includes(g.path),
    )
  }

  async countMembersOfGroup(groupId: string) {
    return (
      (
        await this.keycloakAdminClient.groups.listMembers({
          id: groupId,
        })
      )?.length ?? 0
    )
  }

  async getStudentMetadata(userId: string) {
    const user = await this.keycloakAdminClient.users.findOne({
      id: userId,
    })

    if (!user) {
      return undefined
    }

    return plainToInstance(StudentMetadata, {
      gender: user.attributes?.['gender']?.[0],
      dateOfBirth: user.attributes?.['dateOfBirth']?.[0],
      grade: user.attributes?.['grade']?.[0],
    })
  }

  async onModuleInit() {
    const keycloakIssuer = await Issuer.discover(`${keycloakUrl}/realms/master`)
    const client = new keycloakIssuer.Client({
      client_id: 'admin-cli',
      token_endpoint_auth_method: 'none',
    })

    let tokenSet = await client.grant({
      grant_type: 'password',
      username: 'admin',
      password: 'admin',
    })
    this.setAccessToken(tokenSet)

    this.tokenRefreshInterval = setInterval(async () => {
      try {
        if (!tokenSet.refresh_token) {
          throw new Error('No refresh token found')
        }
        this.logger.verbose('Refreshing keycloak admin token')
        tokenSet = await client.refresh(tokenSet.refresh_token)
        this.setAccessToken(tokenSet)
      } catch (e) {
        this.logger.error(e)
        clearInterval(this.tokenRefreshInterval)
      }
    }, 57 * 1_000)
  }

  private setAccessToken(tokenSet: TokenSet) {
    if (!tokenSet.access_token) {
      throw new Error('No access token for keycloak admin client')
    }
    this.keycloakAdminClient.setAccessToken(tokenSet.access_token)
  }

  onModuleDestroy() {
    clearInterval(this.tokenRefreshInterval)
  }
}
