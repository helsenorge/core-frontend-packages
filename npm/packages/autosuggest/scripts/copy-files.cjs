process.env.BUILD_SOURCESDIRECTORY = process.env.BUILD_SOURCESDIRECTORY ? process.env.BUILD_SOURCESDIRECTORY : 'mockedLocalPath';
const glob = require('glob');
const path = require('path');
const filesMethods = require('@helsenorge/core-build/lib/files');
const { name: packageName } = require('../package.json');

//Files to copy
const rootFiles = ['.npmrc'];
const utilsFiles = [];

/**
 * Function used to resolve build path (often '/lib')
 * @param file - the full path to the current file
 * @param subpath - optional subpath to be added to the buildPath (after /lib)
 */
function resolveBuildPath(file, subpath) {
  if (subpath === void 0) {
    subpath = '';
  }
  return path.resolve(__dirname, '../lib/' + subpath, path.basename(file));
}

// This will copy scss for each component in /src folder over to /lib
const copyScssFiles = glob('src/**/**/*.scss', (er, scssfiles) => {
  console.log('listing up all scss files');
  if (er) {
    console.log(er);
  }

  scssfiles.forEach(file => {
    const filePath = file.substring(0, file.lastIndexOf('/'));
    const libSubPath = filePath.replace('src/', '');
    const outputPath = resolveBuildPath(file, libSubPath);
    filesMethods.copyFile(file, outputPath);
  });
});

// This will copy .scss.d.ts for each component in /src folder over to /lib
const copyStylesModulesTsFiles = glob('src/**/**/*.scss.d.ts', (er, tsfiles) => {
  console.log('listing up all styles modules ts files');
  if (er) {
    console.log(er);
  }

  tsfiles.forEach(file => {
    const filePath = file.substring(0, file.lastIndexOf('/'));
    const libSubPath = filePath.replace('src/', '');
    const outputPath = resolveBuildPath(file, libSubPath);
    filesMethods.copyFile(file, outputPath);
  });
});

Promise.all([
  copyScssFiles,
  copyStylesModulesTsFiles,
  rootFiles.map(file => filesMethods.copyFile(file, resolveBuildPath(file, ''))),
  utilsFiles.map(file => filesMethods.copyFile(file, resolveBuildPath(file, 'utils/'))),
]).then(() =>
  filesMethods.createPackageJsonFile(
    packageName,
    path.resolve(__dirname, '../package.json'),
    path.resolve(__dirname, '../lib/package.json')
  )
);
