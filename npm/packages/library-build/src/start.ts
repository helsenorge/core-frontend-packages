import { existsSync, mkdirSync, copyFileSync } from 'fs';

import esbuild, { Plugin } from 'esbuild';
import { sassPlugin, postcssModules } from 'esbuild-sass-plugin';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const { entry, outDir } = yargs(hideBin(process.argv))
  .options({
    entry: { type: 'string', default: 'src/__devonly__/index.tsx' },
    outDir: { type: 'string', default: 'dist' },
  })
  .parseSync();

if (!existsSync(outDir)) {
  mkdirSync(outDir);
}
copyFileSync(__dirname + '/index.html', outDir + '/index.html');

esbuild.serve(
  {
    port: 3000,
    host: 'localhost',
    servedir: outDir,
  },
  {
    logLevel: 'debug',
    entryPoints: [entry],
    outdir: outDir,
    bundle: true,
    define: {
      global: 'window',
    },
    loader: {
      '.svg': 'dataurl',
    },
    plugins: [
      sassPlugin({
        filter: /.module.(s[ac]ss|css)$/,
        type: 'css',
        transform: postcssModules({
          // ...put here the options for postcss-modules: https://github.com/madyankin/postcss-modules
        }),
      }) as unknown as Plugin,
      sassPlugin({
        filter: /.(s[ac]ss|css)$/,
        type: 'style',
      }) as unknown as Plugin,
    ],
  }
);
