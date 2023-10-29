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
  groups: [],
}

export const mathmagicianStudentUser: User = {
  id: '4554d34f-5bab-436c-ae7f-709c3c738b8a',
  roles: [
    UserRoles.STUDENT,
    UserRoles.OFFLINE_ACCESS,
    UserRoles.UMA_AUTHORIZATION,
    UserRoles.DEFAULT_ROLES_STOCHUS,
  ],
  username: 'mathmagician-student',
  email: 'mathmagician-student@example.com',
  firstName: 'Mathmagician',
  lastName: 'Student',
  groups: [],
}

export const multiGroupStudentUser: User = {
  id: 'c3386385-f826-48e1-ac61-46904d4925b3',
  roles: [
    UserRoles.STUDENT,
    UserRoles.OFFLINE_ACCESS,
    UserRoles.UMA_AUTHORIZATION,
    UserRoles.DEFAULT_ROLES_STOCHUS,
  ],
  username: 'multi-group-student',
  email: 'multi-group-student@example.com',
  firstName: 'Multi-Group',
  lastName: 'Student',
  groups: [],
}

export const researcherUserReggie: User = {
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
  groups: [],
}

export const researcherUserRaymond: User = {
  id: '8dcccd01-8eee-4b1c-a23c-ec6aa2bb1056',
  roles: [
    UserRoles.RESEARCHER,
    UserRoles.OFFLINE_ACCESS,
    UserRoles.UMA_AUTHORIZATION,
    UserRoles.DEFAULT_ROLES_STOCHUS,
  ],
  username: 'raymondResearches',
  email: 'raymond@example.com',
  firstName: 'Raymond',
  lastName: 'Researcher',
  groups: [],
}
