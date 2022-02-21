process.env.BUILD_SOURCESDIRECTORY = process.env.BUILD_SOURCESDIRECTORY ? process.env.BUILD_SOURCESDIRECTORY : 'mockedLocalPath';
const { resolve } = require('path');

const copyfiles = require('copyfiles');

const { createPackageJsonFile } = require('@helsenorge/core-build/lib/files');

const {
  name: packageName,
  publishConfig: { directory: outputDirectory },
} = require('../package.json');

//Files to copy to root directory
const rootFiles = ['.npmrc'];
// Files to copy from src to lib, replacing "src" with "lib"
const additionalFiles = ['src/**/*.{scss,scss.d.ts}'];
// Files to copy to lib/utils
const utilsFiles = [];

Promise.all([
  copyfiles([...rootFiles, outputDirectory], { up: true }, console.error),
  copyfiles([...additionalFiles, outputDirectory], { up: 1 }, console.error),
  copyfiles([...utilsFiles, `${outputDirectory}/utils`], { up: true }, console.error),
]).then(() =>
  createPackageJsonFile(packageName, resolve(__dirname, '../package.json'), resolve(__dirname, `../${outputDirectory}/package.json`))
);
