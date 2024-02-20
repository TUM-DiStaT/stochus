import { Tree, readProjectConfiguration, updateJson } from '@nx/devkit'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import * as fs from 'fs/promises'
import * as path from 'path'
import { assignmentGenerator } from './generator'
import { AssignmentGeneratorSchema } from './schema'

const getActualPrettierConfig = async () => {
  const filePath = path.join(__dirname, '../../../../../../.prettierrc')
  const fileContent = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(fileContent)
}

describe('assignment generator', () => {
  let tree: Tree
  const options: AssignmentGeneratorSchema = { name: 'do-a-backflip' }
  const assignmentBaseDir = `libs/assignments/${options.name}`
  let actualPrettierConfig: object

  beforeAll(async () => {
    actualPrettierConfig = await getActualPrettierConfig()
  })

  beforeEach(() => {
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
  ])('should create %p', async (fileName) => {
    await assignmentGenerator(tree, options)
    expect(tree.exists(fileName)).toBe(true)
    // expect(tree.read(fileName)).toMatchSnapshot()
  })

  it.each([
    `${assignmentBaseDir}/shared/src/index.ts`,
    `${assignmentBaseDir}/shared/src/lib/${options.name}-assignment.ts`,
    `${assignmentBaseDir}/shared/src/lib/${options.name}-assignment.spec.ts`,

    `${assignmentBaseDir}/frontend/src/index.ts`,
    // `${assignmentBaseDir}/frontend/src/lib/${options.name}-assignment-for-frontend.ts`,
    // `${assignmentBaseDir}/frontend/src/lib/assignment-process/${options.name}-assignment-process.component.html`,
    // `${assignmentBaseDir}/frontend/src/lib/assignment-process/${options.name}-assignment-process.component.ts`,
    // `${assignmentBaseDir}/frontend/src/lib/assignment-process/${options.name}-assignment-process.component.spec.ts`,
    // `${assignmentBaseDir}/frontend/src/lib/config-form/${options.name}-config-form.component.html`,
    // `${assignmentBaseDir}/frontend/src/lib/config-form/${options.name}-config-form.component.ts`,
    // `${assignmentBaseDir}/frontend/src/lib/config-form/${options.name}-config-form.component.spec.ts`,
    // `${assignmentBaseDir}/frontend/src/lib/feedback/${options.name}-feedback.component.html`,
    // `${assignmentBaseDir}/frontend/src/lib/feedback/${options.name}-feedback.component.ts`,
    // `${assignmentBaseDir}/frontend/src/lib/feedback/${options.name}-feedback.component.spec.ts`,
  ])('should create %p with the correct contents', async (fileName) => {
    await assignmentGenerator(tree, options)
    expect(tree.exists(fileName)).toBe(true)
    expect(tree.read(fileName)?.toString()).toMatchSnapshot()
  })
})
