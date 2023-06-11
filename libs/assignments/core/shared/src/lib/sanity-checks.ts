import { BaseAssignment } from './base-assignment'

export const getDuplicateIds = (assignments: BaseAssignment[]): string[] =>
  assignments.reduce(
    ({ uniqueIds, duplicates }, { id }) => {
      if (uniqueIds.has(id)) {
        duplicates.push(id)
      }
      uniqueIds.add(id)
      return { uniqueIds, duplicates }
    },
    {
      uniqueIds: new Set<string>(),
      duplicates: [] as string[],
    },
  ).duplicates

export const idsAreUnique = (assignments: BaseAssignment[]): boolean => {
  return getDuplicateIds(assignments).length === 0
}

export const assertUniqueIds = (assignments: BaseAssignment[]): void => {
  const duplicates = getDuplicateIds(assignments)
  if (duplicates.length) {
    throw new Error(
      `Found duplicate assignment IDs (${duplicates.join(', ')})!`,
    )
  }
}
