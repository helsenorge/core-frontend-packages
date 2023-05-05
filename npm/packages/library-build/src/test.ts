'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

process.env.TZ = process.env.TZ ?? 'Europe/Oslo';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const jestInstance = require('jest');
const argv = process.argv.slice(2);

// Always set config
argv.push('--coverage');
argv.push('--verbose');
argv.push('--no-cache');
argv.push('--config=node_modules/@helsenorge/library-build/jest.config.js');

console.log('Du kjører jest med følgende arguments: ', argv);

jestInstance.run(argv);
