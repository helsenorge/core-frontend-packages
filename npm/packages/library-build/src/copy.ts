import path from 'path';

import copyfiles from 'copyfiles';
import { rimraf } from 'rimraf';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

interface Arguments {
  outDir: string;
  root: string[];
  include: string[];
  utils: string[];
  rm: string[];
}

const { outDir, root, include, utils, rm } = yargs(hideBin(process.argv))
  .options({
    outDir: { describe: 'Output directory', type: 'string', default: 'lib' },
    root: { describe: 'Files to copy to root directory', type: 'array', default: [] },
    include: { describe: 'Files to copy from src to lib, replacing "src" with "lib"', type: 'array', default: [] },
    utils: { describe: 'Files to copy to lib/utils', type: 'array', default: [] },
    rm: { describe: 'Files to delete', type: 'array', default: [] },
  })
  .parse() as Arguments;

const outputPath = path.resolve(process.cwd(), outDir);

Promise.all([
  new Promise<void>((resolve, reject) =>
    root.length > 0 ? copyfiles([...root, outputPath], { error: true }, e => (e ? reject(e) : resolve())) : resolve()
  ),
  new Promise<void>((resolve, reject) =>
    include.length > 0 ? copyfiles([...include, outputPath], { up: 1, error: true }, e => (e ? reject(e) : resolve())) : resolve()
  ),
  new Promise<void>((resolve, reject) =>
    utils.length > 0
      ? copyfiles([...utils, path.resolve(outputPath, 'utils')], { up: true, error: true }, e => (e ? reject(e) : resolve()))
      : resolve()
  ),
]).then(() => (rm ? rimraf(rm, { glob: true }) : Promise.resolve(true)));
