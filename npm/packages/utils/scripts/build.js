const fs = require('fs-extra');
const rimraf = require('rimraf');
const { exec } = require('child_process');
const { promisify } = require('util');
const cmd = promisify(exec);

rimraf('./lib', async () => {
  try {
    await cmd('tsc');
    await fs.copy('src/types/dev.d.ts', './lib/dev.d.ts');
    await fs.copy('./package.json', './lib/package.json');
    await fs.copy('./.npmrc', './lib/.npmrc');
    await fs.copy('./readme.md', './lib/readme.md');
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
});
