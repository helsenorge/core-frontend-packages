#! /usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const require = createRequire(import.meta.url);

const args = hideBin(process.argv);

yargs(args)
  .command({
    command: 'build',
    handler: () => {
      const result = spawnSync('node', [require.resolve('./build'), ...args.slice(1)], {
        stdio: 'inherit',
      });
      if (result.status) {
        process.exit(result.status);
      }
    },
  })
  .command({
    command: 'copy',
    handler: () => {
      const result = spawnSync('node', [require.resolve('./copy'), ...args.slice(1)], {
        stdio: 'inherit',
      });
      if (result.status) {
        process.exit(result.status);
      }
    },
  })
  .demandCommand()
  .help()
  .parse();
