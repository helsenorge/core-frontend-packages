import react from '@vitejs/plugin-react';
import { type UserConfigFnPromise, defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export const getConfig: UserConfigFnPromise = async () => {
  return {
    plugins: [react(), tsconfigPaths()],
  };
};

export default defineConfig(async env => getConfig(env));
