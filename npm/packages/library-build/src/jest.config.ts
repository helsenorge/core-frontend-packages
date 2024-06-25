import type { Config } from 'jest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/* Legger til babel-jest + esm og babel-jest igjen uner 'transform' for å kunne håndtere esm import/exports */
/* Viktig å ha @helsenorge pakker under transformIgnorePatterns fordi de eksporteres i rå esm */

let individualConfig;
const rootDir = process.cwd();
try {
  individualConfig = require(rootDir + '/jest.config.cjs');
} catch (ex) {
  console.log('Benytter delt jest.config.js-fil');
}

const config: Config = {
  rootDir,
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/node_modules/@helsenorge/library-build/setupTests.js'],
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    url: 'http://tjenester.helsenorge.utvikling',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\](?!(@helsenorge)[/\\\\])', '^.+\\.module\\.(css|sass|scss|scss.d.ts)$'],
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
  ...individualConfig,
};

export default config;
