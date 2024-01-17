const path = require('path')
const nxPreset = require('@nx/jest/preset').default

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  ...nxPreset,
  setupFilesAfterEnv: [path.join(__dirname, 'jest.setup.js')],
}
