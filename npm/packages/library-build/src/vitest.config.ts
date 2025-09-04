import { UserConfigFn, coverageConfigDefaults, defineConfig } from 'vitest/config';

export const getConfig: UserConfigFn = () => {
  return {
    test: {
      include: ['src/**/__tests__/**/*.[jt]s?(x)', 'src/**/?(*.)+(spec|test).[jt]s?(x)'],
      globals: true,
      environment: 'jsdom',
      environmentOptions: {
        jsdom: {
          url: 'http://tjenester.helsenorge.utvikling',
        },
      },
      setupFiles: ['node_modules/@helsenorge/library-build/setupTests.vite'],
      css: {
        modules: {
          classNameStrategy: 'non-scoped',
        },
      },
      coverage: {
        enabled: true,
        reporter: ['cobertura', 'lcov', 'json'],
        include: ['src/**'],
        exclude: [...coverageConfigDefaults.exclude, '**/__devonly__/**', '**/__mocks__/**', '**/mocks/**'],
      },
      reporters: ['default', 'junit'],
      outputFile: {
        junit: 'test-report.xml',
      },
      server: {
        deps: {
          inline: ['@helsenorge/designsystem-react', '@helsenorge/datepicker', '@helsenorge/lightbox', '@portabletext/react'],
        },
      },
    },
  };
};

export default defineConfig(env => getConfig(env));
