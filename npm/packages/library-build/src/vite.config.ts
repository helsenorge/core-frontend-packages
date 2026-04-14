import react from '@vitejs/plugin-react';
import { type UserConfigFnPromise, defineConfig } from 'vite';

export const getConfig: UserConfigFnPromise = async () => {
  return {
    plugins: [react()],
    resolve: {
      tsconfigPaths: true,
    },
  };
};

export default defineConfig(async env => getConfig(env));
