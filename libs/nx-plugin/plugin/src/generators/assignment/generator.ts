import { Tree, formatFiles, generateFiles } from '@nx/devkit'
import * as path from 'path'
import { AssignmentGeneratorSchema } from './schema'

export async function assignmentGenerator(
  tree: Tree,
  options: AssignmentGeneratorSchema,
) {
  const projectRoot = `libs/assignments/${options.name}`
  // await libraryGenerator(tree, {
  //   name: `${options.name}-assignment-shared`,
  //   tags: 'scope:shared',
  //   importPath: `@stochus/assignments/${options.name}/shared`,
  //   minimal: true,
  //   publishable: false,
  //   linter: 'eslint',
  //   strict: true,
  //   unitTestRunner: 'jest',
  //   buildable: false,
  //   directory: projectRoot + '/shared',
  //   config: 'project',
  //   compiler: 'tsc',
  // })
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options)
  await formatFiles(tree)
}

export default assignmentGenerator
