import { User } from './User'
import { UserRoles } from './UserRoles'

export const studentUser: User = {
  id: '8b6d51c7-d9b9-453d-89b4-d57ff9a91c5a',
  roles: [
    UserRoles.STUDENT,
    UserRoles.OFFLINE_ACCESS,
    UserRoles.UMA_AUTHORIZATION,
    UserRoles.DEFAULT_ROLES_STOCHUS,
  ],
  username: 'student',
  email: 'student@example.com',
  firstName: 'Steve',
  lastName: 'Student',
}

export const researcherUser: User = {
  id: '8dcccd01-8eee-4b1c-a23c-ec6aa2bb1055',
  roles: [
    UserRoles.RESEARCHER,
    UserRoles.OFFLINE_ACCESS,
    UserRoles.UMA_AUTHORIZATION,
    UserRoles.DEFAULT_ROLES_STOCHUS,
  ],
  username: 'researcher',
  email: 'researcher@example.com',
  firstName: 'Reggie',
  lastName: 'Researcher',
}
