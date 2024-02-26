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

const addImport = (original: string, newImport: string): string => {
  const nodes = tsquery.query(
    original,
    // last-child doesn't seem to work and the order will be fixed by prettier
    'ImportDeclaration:first-child',
  )

  if (nodes.length !== 1) {
    console.error(original)
    throw new Error('Could not find the (single) import node')
  }
  const node = nodes[0]

  return original.replace(node.getText(), node.getText() + '\n' + newImport)
}

function addToFrontendService(
  tree: Tree,
  camelCasedName: string,
  options: AssignmentGeneratorSchema,
) {
  const frontendAssignmentService =
    tree.read(frontendAssignmentsServicePath)?.toString() ?? ''
  const withImport = addImport(
    frontendAssignmentService,
    `import { ${camelCasedName}AssignmentForFrontend } from '@stochus/assignments/${options.name}/frontend'`,
  )

  const assignmentsArrayNode = tsquery.query(
    withImport,
    'ClassDeclaration:has(Identifier[name="AssignmentsService"]) > PropertyDeclaration:has(Identifier[name="assignments"]) > ArrayLiteralExpression',
  )
  const lastAssignmentNode = tsquery.query(
    withImport,
    'ClassDeclaration:has(Identifier[name="AssignmentsService"]) > PropertyDeclaration:has(Identifier[name="assignments"]) > ArrayLiteralExpression AsExpression:last-child',
  )

  if (assignmentsArrayNode.length !== 1 || lastAssignmentNode.length !== 1) {
    console.error(withImport)
    throw new Error('Could not find the assignments array node')
  }

  const withAddedAssignment = withImport.replace(
    assignmentsArrayNode[0].getText(),
    assignmentsArrayNode[0].getText().replace(
      lastAssignmentNode[0].getText(),
      `${lastAssignmentNode[0].getText()},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ${camelCasedName}AssignmentForFrontend as any`,
    ),
  )

  tree.write(frontendAssignmentsServicePath, withAddedAssignment)
}

async function addToBackendService(
  tree: Tree,
  camelCasedName: string,
  options: AssignmentGeneratorSchema,
) {
  const backendAssignmentService =
    tree.read(backendAssignmentsServicePath)?.toString() ?? ''
  const withImport = addImport(
    backendAssignmentService,
    `import { ${camelCasedName}Assignment } from '@stochus/assignments/${options.name}/shared'`,
  )
  const assignmentsArrayNode = tsquery.query(
    withImport,
    'ClassDeclaration:has(Identifier[name="AssignmentsCoreBackendService"]) > PropertyDeclaration:has(Identifier[name="assignments"]) > ArrayLiteralExpression',
  )[0]
  const lastAssignmentNode = tsquery.query(
    withImport,
    'ClassDeclaration:has(Identifier[name="AssignmentsCoreBackendService"]) > PropertyDeclaration:has(Identifier[name="assignments"]) > ArrayLiteralExpression Identifier:nth-last-child(2)',
  )[0]
  const withAddedAssignment = withImport.replace(
    assignmentsArrayNode.getText(),
    assignmentsArrayNode
      .getText()
      .replace(
        lastAssignmentNode.getText(),
        `${lastAssignmentNode.getText()}, ${camelCasedName}Assignment`,
      ),
  )
  tree.write(backendAssignmentsServicePath, withAddedAssignment)
}

const addTestingLibraryToFrontendTestSetup = (
  tree: Tree,
  frontendRoot: string,
) => {
  const testSetup =
    tree.read(`${frontendRoot}/src/test-setup.ts`)?.toString() ?? ''
  const withImport = addImport(testSetup, `import '@testing-library/jest-dom'`)
  tree.write(`${frontendRoot}/src/test-setup.ts`, withImport)
}

export async function assignmentGenerator(
  tree: Tree,
  options: AssignmentGeneratorSchema,
) {
  const projectRoot = `libs/assignments/${options.name}`
  const frontendRoot = projectRoot + '/frontend'
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
    directory: frontendRoot,
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
  await addToBackendService(tree, camelCasedName, options)
  addTestingLibraryToFrontendTestSetup(tree, frontendRoot)

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    ...options,
    name: kebabCase(options.name),
    camelCasedName,
  })
  await formatFiles(tree)
}

export default assignmentGenerator
