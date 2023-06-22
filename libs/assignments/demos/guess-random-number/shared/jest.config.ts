/* eslint-disable */
export default {
  displayName: 'assignments-demos-guess-random-number-shared',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../../coverage/libs/assignments/demos/guess-random-number/shared',
}
