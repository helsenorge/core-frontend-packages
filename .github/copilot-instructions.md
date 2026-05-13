# Copilot Instructions — HN-CoreFrontend

This is the **Helsenorge Core Frontend** monorepo: a TypeScript/React codebase producing npm packages and micro frontends for
[helsenorge.no](https://helsenorge.no) (Norway's national health portal).

Requires Node `^24.0.0 || ^26.0.0` and npm `>=11.0.0`.

---

## Repository structure

```
npm/packages/   # Published npm packages (@helsenorge/*)
microweb/       # Micro frontends built as web components (header-footer, cms-blocks)
web/            # Main helsenorge.no web application
Source/         # .NET backend (C# — not relevant for frontend work)
```

Key npm packages and their roles:

- `@helsenorge/library-build` — shared build/test tooling (TypeScript + `library-scripts` CLI) for npm packages
- `@helsenorge/core-build` — shared build/test tooling (Vite-based) for micro frontends and `web/`
- `@helsenorge/framework-utils` — runtime utilities reading from `window.HN` (page metadata, user state, cookies, feature toggles,
  analytics)
- `@helsenorge/core-framework` — React page-level components (PageRoot, Breadcrumb, Pageroot, ErrorBoundary, Feedback, Personvelger, etc.)
- `@helsenorge/core-utils` — pure utility functions (date, string, URL, validation, hooks)
- `@helsenorge/core-cms` — CMS content rendering primitives
- `@helsenorge/eslint-config` — shared ESLint + Stylelint + Prettier config used across all packages

---

## Commands

### Build

The full build has strict ordering due to interdependencies:

```bash
npm run build          # Full monorepo build (follows dependency order)
npm run build:packages # Only npm packages
npm run build:core     # Only packages needed for the web/ app
npm run build:header-footer
npm run build:cms-blocks
```

To build a single workspace:

```bash
npm run build -w @helsenorge/core-utils
```

**Always run `npm run generate:cssdefinitions` before building** if `.module.scss` files have changed — this generates `.module.scss.d.ts`
TypeScript type files.

### Test

```bash
npm test                        # Run all package tests (vitest)
npm test -w @helsenorge/core-utils  # Run tests for a single package
```

To run a single test file within a package:

```bash
cd npm/packages/utils
npx vitest run src/__tests__/my-util.test.ts
```

### Lint / type-check

```bash
npm run validate          # typecheck + prettier + eslint + stylelint (all workspaces)
npm run eslint            # ESLint across all workspaces
npm run stylelint         # Stylelint across all workspaces
npm run prettier          # Prettier check across all workspaces
npm run typecheck         # TypeScript type-check across all workspaces

# Auto-fix:
npm run eslint:fix
npm run stylelint:fix
npm run prettier:fix
```

Per-package (from the package directory):

```bash
npm run eslint
npm run typecheck
```

### Storybook

```bash
cd npm/packages/storybook
npm run start
```

### Playwright (e2e)

```bash
cd web   # or the folder with Playwright tests
npx playwright install   # first time only
npx playwright test
npx playwright test --ui
```

---

## Architecture

### `window.HN` global

Runtime page/user context is injected by the backend into `window.HN`. All packages read from it via `@helsenorge/framework-utils`:

- `window.HN.Page` — current page metadata (path, assets URL, page title GUID, etc.) → `hn-page.ts`
- `window.HN.User` — logged-in user state (privacy settings, identity provider, etc.) → `hn-user.ts`
- `window.HN.Rest` — API base URLs (proxy, CMS content API, etc.)
- `window.HN.FeatureToggles` — feature flags → `feature-toggle/`

Never access `window.HN` directly. Use the typed accessor functions from `@helsenorge/framework-utils`.

### Micro frontends

`microweb/header-footer` and `microweb/cms-blocks` are built as web components and loaded at runtime by the host page. Communication between
micro frontends and the host app uses custom DOM events defined in `@helsenorge/framework-utils/web-component/constants`
(`HeaderFooterEvents`, `CmsBlocksEvents`, `CommonEvents`).

Consuming a web component uses `WebCompConsumer` from `@helsenorge/framework-utils/web-component/consumer`:

```tsx
<WebCompConsumer domain={`${getAssetsUrl()}/cms-blocks`} entryName="cms-blocks" componentName="hn-webcomp-cms-block-promopanel" />
```

### Package exports

All packages use explicit sub-path exports in `package.json` (no barrel `index.ts` re-exports everything). When importing, always use the
exact sub-path:

```ts
import { getPath } from '@helsenorge/framework-utils/hn-page';
import Breadcrumb from '@helsenorge/core-framework/breadcrumb';
```

### npm workspaces & build ordering

The root `package.json` declares workspaces: `microweb/*`, `npm/packages/*`, `web`. Packages depend on each other and must be built in
order. The `npm run build` script encodes this order. When adding a new cross-package dependency, check whether the build script needs to be
updated.

---

## Conventions

### Directory structure inside packages

- `src/**/__tests__/` — unit tests (picked up by vitest automatically)
- `src/**/__mocks__/` — manual mocks
- `src/**/__devonly__/` — dev-only code excluded from published builds
- `src/**/*.stories.tsx` — Storybook stories, co-located with components; excluded from published lib
- `lib/` — compiled output (gitignored per package; generated by build)

### CSS Modules

Use `.module.scss` files. TypeScript types are generated by `generate:cssdefinitions` using `typed-scss-modules` with
`--nameFormat none --exportType default`. Import the default export:

```ts
import styles from './MyComponent.module.scss';
```

### Language

Code comments, JSDoc, variable names, and identifiers specific to domain concepts are written in **Norwegian** (Bokmål). For example:
`Personverninnstilling`, `hasSamtykke`, `getVisPersonvelger`, `Hjelpeskuff`.

### React patterns

- React 19 with the React Compiler (`babel-plugin-react-compiler`).
- Props interfaces are co-located in the same file as the component (not in separate `types.ts` files).
- JSDoc on all public component props.
- Hooks named `use*` are exported from their own files, not from component index files.

### Vitest setup

Tests run with `jsdom`, `globals: true`, and `url: 'http://tjenester.helsenorge.utvikling'`. Packages inherit config from
`@helsenorge/library-build/vitest.config` (for npm packages) or `@helsenorge/core-build/vitest.config` (for microweb/web). Per-package
`vitest.config.ts` only extends, not replaces.

### Versioning & release

All packages are versioned together (monorepo). Releases use the root-level scripts:

```bash
npm run release:patch    # patch bump
npm run release:minor    # minor bump
npm run release:major    # major bump (from beta → stable)
npm run release:beta     # increment beta prerelease
npm run release:premajor # start new major beta
```

After running a release script, push both commits and the tag:

```bash
git push && git push origin tag vX.Y.Z
```

Pushing the tag triggers the CI pipeline that publishes packages to npmjs.org.
