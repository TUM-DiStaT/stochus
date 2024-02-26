import { readFile } from 'fs/promises'
import { join } from 'path'

export const frontendAssignmentsServicePath =
  'libs/assignments/core/frontend/src/lib/assignments.service.ts'

export const backendAssignmentsServicePath =
  'libs/assignments/core/backend/src/lib/assignments-core-backend.service.ts'

export const getActualFileContentFromWorkspaceRootPath = async (
  filePath: string,
) => await readFile(join(__dirname, '../../../../../../', filePath), 'utf-8')

export const getActualPrettierConfig = async () => {
  return JSON.parse(
    await getActualFileContentFromWorkspaceRootPath('.prettierrc'),
  )
}
