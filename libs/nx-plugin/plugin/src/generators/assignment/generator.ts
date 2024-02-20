import {
  UnitTestRunner,
  libraryGenerator as angularLibraryGenerator,
} from '@nx/angular/generators'
import { Tree, formatFiles, generateFiles } from '@nx/devkit'
import { Linter } from '@nx/eslint'
import { libraryGenerator } from '@nx/js'
import * as path from 'path'
import { AssignmentGeneratorSchema } from './schema'

export async function assignmentGenerator(
  tree: Tree,
  options: AssignmentGeneratorSchema,
) {
  const projectRoot = `libs/assignments/${options.name}`
  await libraryGenerator(tree, {
    name: `${options.name}-assignment-shared`,
    tags: 'scope:shared',
    importPath: `@stochus/assignments/${options.name}/shared`,
    minimal: true,
    publishable: false,
    linter: 'eslint',
    strict: true,
    unitTestRunner: 'jest',
    buildable: false,
    directory: projectRoot + '/shared',
    projectNameAndRootFormat: 'as-provided',
    config: 'project',
    compiler: 'tsc',
  })
  await angularLibraryGenerator(tree, {
    name: `${options.name}-assignment-frontend`,
    tags: 'scope:frontend',
    buildable: false,
    linter: Linter.EsLint,
    strict: true,
    publishable: false,
    directory: projectRoot + '/frontend',
    importPath: `@stochus/assignments/${options.name}/frontend`,
    unitTestRunner: UnitTestRunner.Jest,
    projectNameAndRootFormat: 'as-provided',
    prefix: 'stochus',
    standalone: false,
    skipModule: true,
    skipSelector: true,
    standaloneConfig: true,
  })

  // Remove certain generated files that won't be needed
  const sharedFilesToDelete = [
    `src/lib/${options.name}-assignment-shared.ts`,
    `src/lib/${options.name}-assignment-shared.spec.ts`,
  ]
  for (const file of sharedFilesToDelete) {
    tree.delete(`${projectRoot}/shared/${file}`)
  }

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options)
  await formatFiles(tree)
}

export default assignmentGenerator
