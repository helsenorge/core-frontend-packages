const fs = require('fs-extra');
const { exec } = require('child_process');
const rimraf = require('rimraf');

const utilsFiles = ['src/types/dev.d.ts', 'src/types/tabbable.d.ts', 'src/utils/_variables.scss', 'src/types/_variables.scss.d.ts'];

rimraf('./lib', () => {
  exec('tsc');
  fs.copySync('src/types/dev.d.ts', './lib/dev.d.ts');
  fs.copySync('./package.json', './lib/package.json');
  fs.copySync('./.npmrc', './lib/.npmrc');
  fs.copySync('./readme.md', './lib/readme.md');
});
