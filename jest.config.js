module.exports = {
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/assets/css/__mocks__/styleMocks.js',
  },
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>/public`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
};
