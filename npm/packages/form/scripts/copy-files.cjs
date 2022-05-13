process.env.BUILD_SOURCESDIRECTORY = process.env.BUILD_SOURCESDIRECTORY ? process.env.BUILD_SOURCESDIRECTORY : 'mockedLocalPath';
const { resolve } = require('path');

const copyfiles = require('copyfiles');
const rimraf = require('rimraf');

const { createPackageJsonFile } = require('@helsenorge/core-build/lib/files');

const {
  name: packageName,
  publishConfig: { directory: outputDirectory },
} = require('../package.json');

//Files to copy to root directory
const rootFiles = ['.npmrc'];
// Files to copy from src to lib, replacing "src" with "lib"
const additionalFiles = ['src/img/**/*', 'src/**/*.{scss,scss.d.ts}'];
// Files to copy to lib/utils
const utilsFiles = [];
// Files to delete
const deleteFiles = 'lib/__devonly__';

Promise.all([
  copyfiles([...rootFiles, outputDirectory], { up: true }, console.error),
  copyfiles([...additionalFiles, outputDirectory], { up: 1 }, console.error),
  copyfiles([...utilsFiles, `${outputDirectory}/utils`], { up: true }, console.error),
])
  .then(() => rimraf(deleteFiles, () => Promise.resolve()))
  .then(() =>
    createPackageJsonFile(packageName, resolve(__dirname, '../package.json'), resolve(__dirname, `../${outputDirectory}/package.json`))
  );
