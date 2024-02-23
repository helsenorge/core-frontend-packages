import path from 'path';

import copyfiles from 'copyfiles';
import { rimraf } from 'rimraf';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { createPackageJsonFile } from './files';

interface Arguments {
  root: string[];
  include: string[];
  utils: string[];
  rm: string[];
}

const { root, include, utils, rm } = yargs(hideBin(process.argv))
  .options({
    root: { describe: 'Files to copy to root directory', type: 'array', default: [] },
    include: { describe: 'Files to copy from src to lib, replacing "src" with "lib"', type: 'array', default: [] },
    utils: { describe: 'Files to copy to lib/utils', type: 'array', default: [] },
    rm: { describe: 'Files to delete', type: 'array', default: [] },
  })
  .parse() as Arguments;

const originalPackageJson = path.resolve(process.cwd(), 'package.json');

const {
  name: packageName,
  publishConfig: { directory: outputDirectory },
} = require(originalPackageJson);

const outputPath = path.resolve(process.cwd(), outputDirectory);
const newPackageJson = path.resolve(outputPath, 'package.json');

Promise.all([
  new Promise<void>((resolve, reject) => copyfiles([...root, outputPath], e => (e ? reject(e) : resolve()))),
  new Promise<void>((resolve, reject) => copyfiles([...include, outputPath], { up: 1 }, e => (e ? reject(e) : resolve()))),
  new Promise<void>((resolve, reject) =>
    copyfiles([...utils, path.resolve(outputPath, 'utils')], { up: true }, e => (e ? reject(e) : resolve()))
  ),
])
  .then(() => (rm ? rimraf(rm) : Promise.resolve(true)))
  .then(() => createPackageJsonFile(packageName, originalPackageJson, newPackageJson));
