import { existsSync, mkdirSync } from 'fs';

import esbuild from 'esbuild';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

(async (): Promise<void> => {
  const { entry, outDir, tsconfig } = await yargs(hideBin(process.argv))
    .options({
      entry: { type: 'string', default: 'src/__devonly__/index.tsx' },
      outDir: { type: 'string', default: 'dist' },
      tsconfig: { type: 'string', default: 'tsconfig.json' },
    })
    .parse();
  if (!existsSync(outDir)) {
    mkdirSync(outDir);
  }

  await esbuild.build({
    format: 'esm',
    entryPoints: [entry],
    outdir: outDir,
    tsconfig: tsconfig,
    bundle: true,
    external: ['*'],
  });
})();
