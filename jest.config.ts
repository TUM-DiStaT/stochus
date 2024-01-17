import { getJestProjects } from '@nx/jest'
import { JestConfigWithTsJest } from 'ts-jest'

export default {
  projects: getJestProjects(),
} satisfies JestConfigWithTsJest
