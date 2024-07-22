import { defineConfig } from 'vite';

import { getConfig } from '@helsenorge/library-build/vitest.config';

export default defineConfig(async env => {
  return await getConfig(env);
});
