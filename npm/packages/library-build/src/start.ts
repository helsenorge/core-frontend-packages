import { existsSync, mkdirSync, copyFileSync } from 'fs';
import path from 'path';
import url from 'url';

import esbuild from 'esbuild';
import { sassPlugin, postcssModules } from 'esbuild-sass-plugin';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async (): Promise<void> => {
  const { entry, outDir } = await yargs(hideBin(process.argv))
    .options({
      entry: { type: 'string', default: 'src/__devonly__/index.tsx' },
      outDir: { type: 'string', default: 'dist' },
    })
    .parse();
  if (!existsSync(outDir)) {
    mkdirSync(outDir);
  }
  copyFileSync(__dirname + '/index.html', outDir + '/index.html');

  const context = await esbuild.context({
    format: 'esm',
    logLevel: 'debug',
    entryPoints: [entry],
    outdir: outDir,
    bundle: true,
    define: {
      global: 'window',
      'import.meta.env': '{}',
    },
    loader: {
      '.svg': 'dataurl',
      '.woff': 'dataurl',
      '.woff2': 'dataurl',
    },
    plugins: [
      sassPlugin({
        filter: /.module.(s[ac]ss|css)$/,
        type: 'css',
        transform: postcssModules({
          // ...put here the options for postcss-modules: https://github.com/madyankin/postcss-modules
        }),
        importMapper: path => (path.endsWith('styles.module') ? path + '.scss' : path),
        precompile(source, pathname) {
          const basedir = path.dirname(pathname);
          return source.replace(/(url\(['"]?)(\.\.?\/)([^'")]+['"]?\))/g, '$1'.concat(basedir.replace(/\\/g, '\\\\'), '/$2$3'));
        },
      }) as esbuild.Plugin,
      sassPlugin({
        filter: /.(s[ac]ss|css)$/,
        type: 'style',
      }) as esbuild.Plugin,
      {
        name: 'resolve-fonts',
        setup(build): void {
          build.onResolve({ filter: /\.woff2?$/ }, ({ path }) => {
            return { path };
          });
        },
      },
    ],
  });

  await context.watch();

  await context.serve({
    port: 3000,
    host: 'localhost',
    servedir: outDir,
    fallback: outDir + '/index.html',
  });
})();
