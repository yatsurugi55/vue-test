module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'json'],
  transformIgnorePatterns: ['/node_modules/(?!vue)'],
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"]
  }
};

