#! /usr/bin/env node
/* eslint-disable no-console */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const sync = require('cross-spawn').sync;
const args = process.argv.slice(2);

const scriptIndex = args.findIndex(x => x === 'start' || x === 'build' || x === 'copy');
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

switch (script) {
  case 'start':
  case 'build':
  case 'copy': {
    const result = sync('node', nodeArgs.concat(require.resolve('./' + script)).concat(args.slice(scriptIndex + 1)), {
      stdio: 'inherit',
    });
    if (result.signal) {
      if (result.signal === 'SIGKILL') {
        console.log(
          'The build failed because the process exited too early. ' +
            'This probably means the system ran out of memory or someone called ' +
            '`kill -9` on the process.'
        );
      } else if (result.signal === 'SIGTERM') {
        console.log(
          'The build failed because the process exited too early. ' +
            'Someone might have called `kill` or `killall`, or the system could ' +
            'be shutting down.'
        );
      }
      process.exit(1);
    }
    if (result.status) process.exit(result.status);
    break;
  }
  default:
    console.log('Unknown script "' + script + '".');
    console.log('Perhaps you need to update @helsenorge/library-build?');
    break;
}
