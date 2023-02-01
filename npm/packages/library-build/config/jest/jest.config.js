/* Legger til babel-jest + esm og babel-jest igjen uner 'transform' for å kunne håndtere esm import/exports */
/* Viktig å ha @helsenorge pakker under transformIgnorePatterns fordi de eksporteres i rå esm */

const rootDir = process.cwd();

module.exports = {
  rootDir,
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/node_modules/@helsenorge/library-build/setupTests.js'],
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom',
  testURL: 'http://tjenester.helsenorge.utvikling',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\](?!@helsenorge[/\\\\])', '^.+\\.module\\.(css|sass|scss|scss.d.ts)$'],
  coverageReporters: ['cobertura', 'lcov', 'json'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.ts',
    '**/*.tsx',
    '!**/node_modules/**',
    '!**/lib/**',
    '!**/dist/**',
    '!**/__devonly__/**',
    '!**/scripts/**',
    '!**/types/**',
    '!**/constants/*.ts',
    '!**/*types.ts',
  ],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  moduleDirectories: ['node_modules', 'src'],
  // Unngå warning om jest-haste-map: Haste module naming collision
  modulePathIgnorePatterns: ['lib'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  coveragePathIgnorePatterns: ['^.+\\.module\\.(css|sass|scss|scss.d.ts)$'],
  testResultsProcessor: 'jest-junit-reporter',
  snapshotSerializers: ['enzyme-to-json/serializer'],
  cacheDirectory: '<rootDir>/.jest-cache',
};
