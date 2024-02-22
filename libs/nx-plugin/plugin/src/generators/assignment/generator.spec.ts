import { Tree, readProjectConfiguration, updateJson } from '@nx/devkit'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { tsquery } from '@phenomnomnominal/tsquery'
import * as fs from 'fs/promises'
import { camelCase, upperFirst } from 'lodash'
import * as path from 'path'
import {
  backendAssignmentsServicePath,
  frontendAssignmentsServicePath,
} from './file-paths'
import { assignmentGenerator } from './generator'
import { AssignmentGeneratorSchema } from './schema'

const getActualFileContentFromWorkspaceRootPath = async (filePath: string) =>
  await fs.readFile(
    path.join(__dirname, '../../../../../../', filePath),
    'utf-8',
  )

const getActualPrettierConfig = async () => {
  return JSON.parse(
    await getActualFileContentFromWorkspaceRootPath('.prettierrc'),
  )
}

describe('assignment generator', () => {
  let tree: Tree
  const options: AssignmentGeneratorSchema = { name: 'do-a-backflip' }
  const assignmentBaseDir = `libs/assignments/${options.name}`
  let actualPrettierConfig: object

  beforeAll(async () => {
    actualPrettierConfig = await getActualPrettierConfig()
  })

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace()
    expect(tree.exists('.prettierrc')).toBe(true)
    updateJson(tree, '.prettierrc', (json) => ({
      ...json,
      ...actualPrettierConfig,
    }))

    // Tell the library generator where to create the new project
    process.env.INIT_CWD = tree.root
    jest.spyOn(process, 'cwd').mockReturnValue(tree.root)

    // Avoid warning messages from angular generator that no .gitignore can be found
    tree.write('.gitignore', '')

    // Add current assignment services
    const frontendAssignmentsServiceContent =
      await getActualFileContentFromWorkspaceRootPath(
        frontendAssignmentsServicePath,
      )
    tree.write(
      frontendAssignmentsServicePath,
      frontendAssignmentsServiceContent,
    )
    const backendAssignmentsServiceContent =
      await getActualFileContentFromWorkspaceRootPath(
        backendAssignmentsServicePath,
      )
    tree.write(backendAssignmentsServicePath, backendAssignmentsServiceContent)
  })

  it('should create shared project', async () => {
    await assignmentGenerator(tree, options)
    const config = readProjectConfiguration(
      tree,
      `${options.name}-assignment-shared`,
    )
    expect(config).toBeDefined()
    expect(config.tags).toContain('scope:shared')
    expect(config.projectType).toBe('library')
  })

  it('should create frontend project', async () => {
    await assignmentGenerator(tree, options)
    const config = readProjectConfiguration(
      tree,
      `${options.name}-assignment-frontend`,
    )
    expect(config).toBeDefined()
    expect(config.tags).toContain('scope:frontend')
    expect(config.projectType).toBe('library')
  })

  it.each([
    `${assignmentBaseDir}/shared/src/lib/${options.name}-assignment-shared.ts`,
    `${assignmentBaseDir}/shared/src/lib/${options.name}-assignment-shared.spec.ts`,
    `${assignmentBaseDir}/frontend/src/lib/${options.name}-assignment-frontend.component.ts`,
    `${assignmentBaseDir}/frontend/src/lib/${options.name}-assignment-frontend.component.spec.ts`,
    `${assignmentBaseDir}/frontend/src/lib/${options.name}-assignment-frontend.component.html`,
    `${assignmentBaseDir}/frontend/src/lib/${options.name}-assignment-frontend.component.css`,
  ])('should delete the unneeded file %p', async (filePath) => {
    await assignmentGenerator(tree, options)
    expect(tree.exists(filePath)).toBe(false)
  })

  it.each([
    `${assignmentBaseDir}/shared/src/index.ts`,
    `${assignmentBaseDir}/shared/src/lib/${options.name}-assignment.ts`,
    `${assignmentBaseDir}/shared/src/lib/${options.name}-assignment.spec.ts`,

    `${assignmentBaseDir}/frontend/src/index.ts`,
    `${assignmentBaseDir}/frontend/src/lib/${options.name}-assignment-for-frontend.ts`,
    `${assignmentBaseDir}/frontend/src/lib/assignment-process/${options.name}-assignment-process.component.html`,
    `${assignmentBaseDir}/frontend/src/lib/assignment-process/${options.name}-assignment-process.component.ts`,
    `${assignmentBaseDir}/frontend/src/lib/assignment-process/${options.name}-assignment-process.component.spec.ts`,
    `${assignmentBaseDir}/frontend/src/lib/config-form/${options.name}-config-form.component.html`,
    `${assignmentBaseDir}/frontend/src/lib/config-form/${options.name}-config-form.component.ts`,
    `${assignmentBaseDir}/frontend/src/lib/config-form/${options.name}-config-form.component.spec.ts`,
    `${assignmentBaseDir}/frontend/src/lib/feedback/${options.name}-feedback.component.html`,
    `${assignmentBaseDir}/frontend/src/lib/feedback/${options.name}-feedback.component.ts`,
    `${assignmentBaseDir}/frontend/src/lib/feedback/${options.name}-feedback.component.spec.ts`,
  ])('should create %p with the correct contents', async (fileName) => {
    await assignmentGenerator(tree, options)
    expect(tree.exists(fileName)).toBe(true)
    expect(tree.read(fileName)?.toString()).toMatchSnapshot()
  })

  it('should add the asssignment to the frontend service', async () => {
    await assignmentGenerator(tree, options)
    const assignmentServiceCode =
      tree.read(frontendAssignmentsServicePath)?.toString() ?? ''
    expect(assignmentServiceCode).not.toBe('')

    const assignmentForFrontendDefinitionName =
      upperFirst(camelCase(options.name)) + 'AssignmentForFrontend'

    // Import should exist
    const importLiteralNodes = tsquery.query(
      assignmentServiceCode,
      `ImportDeclaration:has(Identifier[name="${assignmentForFrontendDefinitionName}"]):has(StringLiteral[value="@stochus/assignments/${options.name}/frontend"])`,
    )
    expect(importLiteralNodes).toHaveLength(1)

    // Assignment should be added to the array
    const assignmentsArrayLiteralNodes = tsquery.query(
      assignmentServiceCode,
      'ClassDeclaration:has(Identifier[name="AssignmentsService"]) ' +
        '> PropertyDeclaration:has(Identifier[name="assignments"]) ' +
        `> ArrayLiteralExpression`,
    )
    expect(assignmentsArrayLiteralNodes).toHaveLength(1)
    const assignmentsArrayLiteral = assignmentsArrayLiteralNodes[0]
    expect(assignmentsArrayLiteral.getFullText()).toMatch(
      assignmentForFrontendDefinitionName + ' as any',
    )
    // It should be added with the eslint-disable-next-line comment
    expect(assignmentsArrayLiteral.getFullText()).toMatch(
      /\/\/ eslint-disable-next-line @typescript-eslint\/no-explicit-any\n\s*DoABackflipAssignmentForFrontend as any/,
    )

    // This final assertion is just meant for manual review of the final file.
    // If it ever fails, the assertions above *should* be enough to ensure functionality.
    // Still, take a second to look at the changes and see if this code would still work.
    expect(assignmentServiceCode).toMatchSnapshot()
  })

  it('should add the asssignment to the backend service', async () => {
    await assignmentGenerator(tree, options)
    const assignmentServiceCode =
      tree.read(backendAssignmentsServicePath)?.toString() ?? ''
    expect(assignmentServiceCode).not.toBe('')

    const assignmentDefinitionName =
      upperFirst(camelCase(options.name)) + 'Assignment'

    // Import should exist
    const importLiteralNodes = tsquery.query(
      assignmentServiceCode,
      `ImportDeclaration:has(Identifier[name="${assignmentDefinitionName}"]):has(StringLiteral[value="@stochus/assignments/${options.name}/shared"])`,
    )
    expect(importLiteralNodes).toHaveLength(1)

    // Assignment should be added to the array
    const assignmentsArrayLiteralNodes = tsquery.query(
      assignmentServiceCode,
      'ClassDeclaration:has(Identifier[name="AssignmentsCoreBackendService"]) > PropertyDeclaration:has(Identifier[name="assignments"]) > ArrayLiteralExpression Identifier:nth-last-child(2)',
    )
    expect(assignmentsArrayLiteralNodes).toHaveLength(1)
    const assignmentsArrayLiteral = assignmentsArrayLiteralNodes[0]
    expect(assignmentsArrayLiteral.getFullText()).toMatch(
      assignmentDefinitionName,
    )

    // This final assertion is just meant for manual review of the final file.
    // If it ever fails, the assertions above *should* be enough to ensure functionality.
    // Still, take a second to look at the changes and see if this code would still work.
    expect(assignmentServiceCode).toMatchSnapshot()
  })
})
