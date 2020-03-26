const fs = require('fs-extra');
const { promisify } = require('util');
const { exec } = require('child_process');
const rimraf = require('rimraf');
const path = require('path');
const cmd = promisify(exec);

const packagejson = require('./package.json');
const root = path.resolve(__dirname, '..', '..', '..');

console.log(root);
const packages = [
  { path: path.join(root, 'microweb', 'header-footer'), dependencieTypes: ['dependencies'] },
  { path: path.join(root, 'npm', 'packages', 'toolkit'), dependencieTypes: ['peerDependencies', 'devDependencies'] },
  { path: path.join(root, 'npm', 'packages', 'framework'), dependencieTypes: ['devDependencies', 'peerDependencies'] },
  { path: path.join(root, 'npm', 'packages', 'cms'), dependencieTypes: ['devDependencies', 'peerDependencies'] },
  { path: path.join(root, 'web'), dependencieTypes: ['dependencies'] },
];

rimraf('./lib', async () => {
  try {
    await cmd('tsc');
    await fs.copy('src/types/dev.d.ts', './lib/dev.d.ts');
    await fs.copy('./package.json', './lib/package.json');
    await fs.copy('./.npmrc', './lib/.npmrc');
    await fs.copy('./readme.md', './lib/readme.md');
    packages.forEach(e => {
      packagesetter(e.path, e.dependencieTypes);
    });
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
});

const packagesetter = (filepath, dependencies) => {
  let packageJsonPath = path.join(filepath, 'package.json');
  const packages = require(packageJsonPath);
  dependencies.forEach(e => {
    if (e === 'peerDependencies') {
      packages[e][packagejson.name] = `>= ${packagejson.version}`;
    } else {
      packages[e][packagejson.name] = packagejson.version;
    }
  });
};
