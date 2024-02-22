import {
  UnitTestRunner,
  libraryGenerator as angularLibraryGenerator,
} from '@nx/angular/generators'
import { Tree, formatFiles, generateFiles } from '@nx/devkit'
import { Linter } from '@nx/eslint'
import { libraryGenerator } from '@nx/js'
import { tsquery } from '@phenomnomnominal/tsquery'
import { camelCase, kebabCase, upperFirst } from 'lodash'
import * as path from 'path'
import {
  backendAssignmentsServicePath,
  frontendAssignmentsServicePath,
} from './file-paths'
import { AssignmentGeneratorSchema } from './schema'

function addToFrontendService(
  tree: Tree,
  camelCasedName: string,
  options: AssignmentGeneratorSchema,
) {
  const frontendAssignmentService =
    tree.read(frontendAssignmentsServicePath)?.toString() ?? ''
  const withImport = tsquery.replace(
    frontendAssignmentService,
    // last-child doesn't seem to work and the order will be fixed by prettier
    'ImportDeclaration:first-child',
    (node) => {
      return (
        node.getText() +
        '\n' +
        `import { ${camelCasedName}AssignmentForFrontend } from '@stochus/assignments/${options.name}/frontend'`
      )
    },
  )
  const withAddedAssignment = tsquery.replace(
    withImport,
    'ClassDeclaration:has(Identifier[name="AssignmentsService"]) > PropertyDeclaration:has(Identifier[name="assignments"]) > ArrayLiteralExpression AsExpression:last-child',
    (node) => {
      return (
        node.getText() +
        `,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ${camelCasedName}AssignmentForFrontend as any`
      )
    },
  )
  tree.write(frontendAssignmentsServicePath, withAddedAssignment)
}

function addToBackendService(
  tree: Tree,
  camelCasedName: string,
  options: AssignmentGeneratorSchema,
) {
  const backendAssignmentService =
    tree.read(backendAssignmentsServicePath)?.toString() ?? ''
  const withImport = tsquery.replace(
    backendAssignmentService,
    // last-child doesn't seem to work and the order will be fixed by prettier
    'ImportDeclaration:first-child',
    (node) => {
      return (
        node.getText() +
        '\n' +
        `import { ${camelCasedName}Assignment } from '@stochus/assignments/${options.name}/shared'`
      )
    },
  )
  const withAddedAssignment = tsquery.replace(
    withImport,
    'ClassDeclaration:has(Identifier[name="AssignmentsCoreBackendService"]) > PropertyDeclaration:has(Identifier[name="assignments"]) > ArrayLiteralExpression Identifier:nth-last-child(2)',
    (node) => {
      return (
        node.getText() +
        `,
        ${camelCasedName}Assignment`
      )
    },
  )
  tree.write(backendAssignmentsServicePath, withAddedAssignment)
}

export async function assignmentGenerator(
  tree: Tree,
  options: AssignmentGeneratorSchema,
) {
  const projectRoot = `libs/assignments/${options.name}`
  const camelCasedName = upperFirst(camelCase(options.name))

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

  addToFrontendService(tree, camelCasedName, options)
  addToBackendService(tree, camelCasedName, options)

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    ...options,
    name: kebabCase(options.name),
    camelCasedName,
  })
  await formatFiles(tree)
}

export default assignmentGenerator
