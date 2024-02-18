import { Tree, readProjectConfiguration } from '@nx/devkit'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { assignmentGenerator } from './generator'
import { AssignmentGeneratorSchema } from './schema'

describe('assignment generator', () => {
  let tree: Tree
  const options: AssignmentGeneratorSchema = { name: 'test' }

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should run successfully', async () => {
    await assignmentGenerator(tree, options)
    const config = readProjectConfiguration(tree, 'test')
    expect(config).toBeDefined()
  })
})
