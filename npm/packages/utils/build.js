const fs = require('fs-extra');
const { exec } = require('child_process');
const rimraf = require('rimraf');

// const filterFunc = (src, dest) => {
//   console.log(src)
//   // your logic here
//   // it will be copied if return true
//   return !src.includes("__tests__")
// }

rimraf('./lib', () => {
  exec('tsc');
  // fs.copy('./src', './lib', { filter: filterFunc }, err => {
  //   if (err) return console.error(err)

  //   console.log('success!')
  // }) // copies file

  fs.copySync('./package.json', './lib/package.json');
  fs.copySync('./.npmrc', './lib/.npmrc');
  fs.copySync('./readme.md', './lib/readme.md');
});
