import { resolve } from 'path';

import copyfiles from 'copyfiles';
import { rimraf } from 'rimraf';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { createPackageJsonFile } from './files';

interface Arguments {
  root: string[];
  include: string[];
  utils: string[];
  rm: string;
}

const { root, include, utils, rm } = yargs(hideBin(process.argv))
  .options({
    root: { describe: 'Files to copy to root directory', type: 'array', default: [] },
    include: { describe: 'Files to copy from src to lib, replacing "src" with "lib"', type: 'array', default: [] },
    utils: { describe: 'Files to copy to lib/utils', type: 'array', default: [] },
    rm: { describe: 'Files to delete', type: 'string', default: '' },
  })
  .parse() as Arguments;

const originalPackageJson = resolve(process.cwd(), 'package.json');

const {
  name: packageName,
  publishConfig: { directory: outputDirectory },
} = require(originalPackageJson);

const outputPath = resolve(process.cwd(), outputDirectory);
const newPackageJson = resolve(outputPath, 'package.json');

Promise.all([
  copyfiles([...root, outputPath], console.error),
  copyfiles([...include, outputPath], { up: 1 }, console.error),
  copyfiles([...utils, resolve(outputPath, 'utils')], { up: true }, console.error),
])
  .then(() => (rm ? rimraf(rm) : Promise.resolve(true)))
  .then(() => createPackageJsonFile(packageName, originalPackageJson, newPackageJson));
