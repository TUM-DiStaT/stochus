import { TestBed } from '@angular/core/testing'

import { AuthGuard } from './auth.guard'
import { KeycloakTestingModule } from './KeycloakTestingModule'
import { KeycloakService } from 'keycloak-angular'
import { RouterTestingModule } from '@angular/router/testing'
import { UserRoles } from '@stochus/auth/shared'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'

describe('AuthGuard', () => {
  let guard: AuthGuard
  let keycloakService: KeycloakService
  let isLoggedInSpy: jest.SpyInstance<Promise<boolean>>
  let getUserRolesSpy: jest.SpyInstance<string[]>
  let loginSpy: jest.SpyInstance<Promise<void>>

  const requiresNoSpecialRolesSnapshot = {} as unknown as ActivatedRouteSnapshot

  const requiresResearcherRoleSnapshot = {
    data: {
      roles: [UserRoles.RESEARCHER],
    },
  } as unknown as ActivatedRouteSnapshot

  const routerState = {
    url: '/foo/bar',
  } as RouterStateSnapshot

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KeycloakTestingModule, RouterTestingModule],
    })
    keycloakService = TestBed.inject(KeycloakService)
    isLoggedInSpy = jest.spyOn(keycloakService, 'isLoggedIn')
    getUserRolesSpy = jest
      .spyOn(keycloakService, 'getUserRoles')
      .mockReturnValue([])
    loginSpy = jest.spyOn(keycloakService, 'login').mockResolvedValue()
    guard = TestBed.inject(AuthGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })

  it('should return false and redirect to login if user is not authenticated', async () => {
    // given
    expect(loginSpy).not.toHaveBeenCalled()
    isLoggedInSpy.mockResolvedValue(false)

    // when
    const canActivate = await guard.canActivate(
      requiresNoSpecialRolesSnapshot,
      routerState,
    )

    // then
    expect(canActivate).toBe(false)
    expect(loginSpy).toHaveBeenCalled()
  })

  it("should return false if user doesn't have the required role", async () => {
    // given
    isLoggedInSpy.mockResolvedValue(true)
    getUserRolesSpy.mockReturnValue([UserRoles.STUDENT])

    // when
    const canActivate = await guard.canActivate(
      requiresResearcherRoleSnapshot,
      routerState,
    )

    // then
    expect(canActivate).toBe(false)
    expect(loginSpy).not.toHaveBeenCalled()
  })

  it('should return true if user has the required roles', async () => {
    // given
    isLoggedInSpy.mockResolvedValue(true)
    getUserRolesSpy.mockReturnValue([UserRoles.RESEARCHER])

    // when
    const canActivate = await guard.canActivate(
      requiresResearcherRoleSnapshot,
      routerState,
    )

    // then
    expect(canActivate).toBe(true)
    expect(loginSpy).not.toHaveBeenCalled()
  })

  it('should return true if no roles are required', async () => {
    // given
    isLoggedInSpy.mockResolvedValue(true)
    getUserRolesSpy.mockReturnValue([UserRoles.RESEARCHER])

    // when
    const canActivate = await guard.canActivate(
      requiresNoSpecialRolesSnapshot,
      routerState,
    )

    // then
    expect(canActivate).toBe(true)
    expect(loginSpy).not.toHaveBeenCalled()
  })
})
