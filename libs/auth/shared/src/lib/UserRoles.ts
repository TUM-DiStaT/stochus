export enum UserRoles {
  OFFLINE_ACCESS = 'offline_access',
  DEFAULT_ROLES_STOCHUS = 'default-roles-stochus',
  UMA_AUTHORIZATION = 'uma_authorization',
  MANAGE_ACCOUNT = 'manage-account',
  MANAGE_ACCOUNT_LINKS = 'manage-account-links',
  VIEW_PROFILE = 'view-profile',
  STUDENT = 'student',
  RESEARCHER = 'researcher',
}

const invertedRoles = Object.values(UserRoles).reduce(
  (acc, role) => ({ ...acc, [role]: true }),
  {} as Record<string, boolean>,
)

export const isValidRoles = (roles: string[]): roles is UserRoles[] => {
  return roles.every((role) => invertedRoles[role] ?? false)
}
