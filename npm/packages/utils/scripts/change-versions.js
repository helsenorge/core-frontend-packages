const path = require('path');
const { promisify } = require('util');
const fs = require('fs-extra');
const { exec } = require('child_process');

const cmd = promisify(exec);

const packagejson = require('../package.json');
const root = path.resolve(__dirname, '..', '..', '..', '..');

const packages = [
  { path: path.join(root, 'microweb', 'header-footer'), dependencieTypes: ['dependencies'] },
  { path: path.join(root, 'npm', 'packages', 'toolkit'), dependencieTypes: ['peerDependencies', 'devDependencies'] },
  { path: path.join(root, 'npm', 'packages', 'framework'), dependencieTypes: ['devDependencies', 'peerDependencies'] },
  { path: path.join(root, 'npm', 'packages', 'cms'), dependencieTypes: ['devDependencies', 'peerDependencies'] },
  { path: path.join(root, 'web'), dependencieTypes: ['dependencies'] },
];
const packagePathCreator = packagePath => {
  return path.join(packagePath, 'package.json');
};

const versionSetter = async () => {
  try {
    let newPackages = packages.map(e => {
      let packageJsonPath = packagePathCreator(e.path);
      const jsonPackage = require(packageJsonPath);
      e.dependencieTypes.forEach(e => {
        if (e === 'peerDependencies') {
          jsonPackage[e][packagejson.name] = `>= ${packagejson.version}`;
        } else {
          jsonPackage[e][packagejson.name] = packagejson.version;
        }
      });
      return { package: jsonPackage, path: e.path };
    });

    let changeVersion = newPackages.map(e => {
      let packageJsonPath = packagePathCreator(e.path);
      return fs.writeJsonSync(packageJsonPath, e.package, { spaces: 3 });
    });

    let install = newPackages.map(e => {
      return cmd('npm i ', { cwd: e.path });
    });
    let prettify = newPackages.map(e => {
      let packageJsonPath = packagePathCreator(e.path);
      return cmd(`prettier --write ${packageJsonPath} `, { cwd: e.path });
    });
    await Promise.all([...changeVersion, ...install, ...prettify]);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

(async () => {
  try {
    await versionSetter();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
