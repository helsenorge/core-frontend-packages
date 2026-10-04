---
name: storybook-stories
description:
  Create, update, maintain and audit Storybook stories for the @helsenorge/* npm packages in HN-CoreFrontend. Use this when asked to add a
  story, write stories for a component, complete/fix story args or argTypes, mock API data in Storybook with MSW, check which components are
  missing stories, or keep stories in sync after component props change. Applies to npm/packages/* only (not microweb/ or web/).
---

# Helsenorge Storybook Stories Guide

This guide describes how stories are written in HN-CoreFrontend. Follow the existing patterns — consistency across ~100 story files matters
more than personal preference.

---

## 1. Scope

- Storybook lives in `npm/packages/storybook` (workspace name `storybook-documentation`, Storybook 10, `@storybook/react-vite`).
- Stories exist **only for `npm/packages/*`**. Never add stories to `microweb/` or `web/`.
- `npm/packages/storybook/.storybook/main.ts` lists one glob per package. Packages currently included: `autosuggest`, `cms`, `data-table`,
  `file-upload`, `filter`, `framework-utils`, `framework`, `microweb`, `pdf-preview`, `step`. **If you add the first story to a package not
  in this list, add its glob to `main.ts`.**
- Global setup in `.storybook/preview.tsx`: `tags: ['autodocs']` (docs page generated from JSDoc on props), Amplitude decorator,
  grid/full-width layout toolbar, MSW loader with `onUnhandledRequest: 'bypass'`, and a few global MSW handlers.
- `.storybook/preview-head.html` sets `window.HN` (`Rest.*` URLs → `helsenorge-mas-01` / `tjenester-hn-mas-01`, feature toggles) and loads
  `helsenorge.css`. Don't redefine `window.HN` in stories; mock the request instead (section 8).

---

## 2. Does this component need its own story?

Write a story for components that **consumers use directly** — check the package's `package.json` `exports`.

**Skip** a dedicated story when the component is a building block that is clearly demonstrated by a parent story. Examples:

| Component                                                   | Covered by                                       |
| ----------------------------------------------------------- | ------------------------------------------------ |
| `framework/feedback/score-input`, `feedback/container`      | `framework/feedback` (Feedback/Smiley)           |
| `cms/richtext/components/*`                                 | `cms/richtext` (Blocks/PortableText)             |
| `cms/tjenestepanel-v2/*` (toggle-button, tjenester-list, …) | `cms/tjenestepanel-v2` (Frontpage/Tjenestepanel) |
| `cms/cookie-banner/horizontal-rule`                         | `cms/cookie-banner` (Cookie/CookieBanner)        |

A skip only counts if the parent story **actually renders** the subcomponent. Example: `cms/search-v2/page/components/search-hit(s)` are not
covered today, because the `SearchPage` story uses an empty query and fetches nothing. They are only covered once `SearchPage` has a variant
with a query and MSW-mocked search results. Open the parent story (or render it, section 10) before deciding to skip.

If a subcomponent has **states the parent story can't show** (e.g. error, empty), prefer adding a variant to the parent story over a
separate file. Hooks and utils only get a story when a visual demo adds value (see `framework-utils/utils/*` and
`framework/resources/useResources.stories.tsx`).

---

## 3. File placement and naming

- Co-locate with the component: `<component-dir>/<name>.stories.tsx`, kebab-case. `<name>` is usually the folder name
  (`cms/src/promopanel/promopanel.stories.tsx`), but follow the component's name when it differs (`richtext/portable-text.stories.tsx`,
  `search-v2/page/search-page.stories.tsx`, `data-table/src/components/table/data-table.stories.tsx`). **Never rename existing story files**
  just to match this rule.
- Import the component from its folder: `import Promopanel from '.';`
- Larger fixtures go in `<component-dir>/__mocks__/<name>.ts` (e.g. `cms/src/promopanel/__mocks__/example.ts`).
- `*.stories.tsx` and `__mocks__/` are excluded from the published `lib/`.

### Title taxonomy

`title: '@helsenorge/<npm-package-name>/<Group>/<ComponentName>'` — reuse an existing group whenever possible:

| Package                       | Pattern                                                  | Existing groups                                                                                                                                                       |
| ----------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@helsenorge/core-cms`        | `@helsenorge/core-cms/<Group>/<Name>`                    | `Blocks`, `Cookie`, `Frontpage`, `Global`, `Samvalg`, `Search`, `UserResearch` (+ top-level `TrackPageView`)                                                          |
| `@helsenorge/core-framework`  | `@helsenorge/core-framework/<Group>/<Name>` or top-level | `EntryPageRoot`, `EntryPageRoot/TjenesteContent`, `Feedback`, `PageRoot`, `Prosesshjelp`; top-level: `ErrorBoundary`, `ErrorMessage`, `MicrowebRoot`, `PageLoader`, … |
| `@helsenorge/framework-utils` | `@helsenorge/framework-utils/<kind>/<Name>`              | `components`, `utils`, `web-component`                                                                                                                                |
| Smaller packages              | `@helsenorge/<pkg>/components/<Name>`                    | autosuggest, data-table, file-upload, filter, pdf-preview, step                                                                                                       |

`<Name>` is PascalCase for components; hooks/utils keep their function name (`useSurveys`, `getFeatureToggle`). The title uses the **npm
package name** (`core-cms`, `core-framework`), not the folder name.

Known exceptions — keep them, don't "fix" them (changing a title changes story URLs):

- `framework/src/resources/useResources.stories.tsx` and `useSuspenseResources.stories.tsx` live in `core-framework` but are titled
  `@helsenorge/framework-utils/utils/...`.
- `@helsenorge/microweb/registerWebComponent` is top-level, without a `components` group.

When unsure, copy the taxonomy of the neighbouring stories in the same package.

---

## 4. Story file template (CSF3)

```tsx
import { fn } from 'storybook/test';

import type { Meta, StoryObj } from '@storybook/react-vite';

import Image from '.';

const meta = {
  title: '@helsenorge/core-cms/Blocks/Image',
  component: Image,
  args: {
    // all args shared by the stories (see section 5)
  },
  argTypes: {
    size: { control: { type: 'select' }, options: ['Small', 'Medium', 'Large'] },
  },
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: { size: 'Large' },
};
```

- Always `satisfies Meta<typeof X>` (not `: Meta<…>`), and `type Story = StoryObj<typeof meta>`.
- Always export `Default` first, with args defined on `meta` so `Default` can be `{}`.
- Import order follows the repo ESLint config (external → types → `@helsenorge/*` → relative → `.`). Run `npm run eslint:fix` if unsure.
- Use `render` only when the component needs surrounding markup or local state (e.g. `render: args => <CookieExample {...args} />`). Name a
  stateful render function (`render: function Render(args) { … }`) so hooks are allowed.

---

## 5. Args — complete and realistic

The goal: every prop in the props interface is either in `args` or deliberately excluded.

1. **Read the props interface** (co-located in the component file). List required and optional props.
2. **All required props** must have a value in `meta.args`.
3. **Optional props** that change what the user sees (texts, variants, toggles, colours, sizes) should also have a value, so they show up as
   editable controls. Leave out props that only exist for internal wiring or testing (`testId`, refs, `className`).
4. **Callbacks** → `fn()` from `storybook/test` (shows calls in the Actions panel):
   ```ts
   args: { onClick: fn(), onClose: fn() },
   ```
5. **Content is realistic Norwegian (Bokmål)** helsenorge content — real-looking titles, ingresses and links to
   `https://www.helsenorge.no/...`. No lorem ipsum, no `'test'`, no `'foo'`.
   ```ts
   // ✅
   tittel: 'Plages du av langvarige smerter?',
   // ❌
   tittel: 'Test title',
   ```
6. **Literal unions** need `as const` in shared fixtures: `backgroundColor: 'cherry50' as const`.
7. **Fixtures longer than ~20 lines** go in `__mocks__/<name>.ts` and are imported. Type them with the package's entity types
   (`types/entities/*`) so they break when the API shape changes.
8. **argTypes only when they add something** — autodocs already reads type info and JSDoc from the props interface, so don't repeat
   descriptions. Use `argTypes` to:
   - give union/enum props a `select`/`radio` control: `size: { control: { type: 'select' }, options: ['Small', 'Medium', 'Large'] }`
   - hide props that can't be edited meaningfully: `children: { control: false }`
   - Don't add `argTypes: {}` (empty) or `{ control: 'text' }` for plain string props — Storybook infers those.
9. If a prop is missing JSDoc, add the JSDoc **in the component's props interface** (Norwegian), not in the story.

---

## 6. How many stories? — moderate

- `Default` + **1–4 variants** that show **distinct visual or behavioural states**, e.g. empty list, many items, error, loading, logged in
  vs. logged out, with/without image, a different layout variant.
- **Never one story per prop.** Controls already let readers try every prop value.
- Name variants in PascalCase by what is different: `WithoutImage`, `TwoColumns`, `OneChild`, `Error`, `Empty`, `LoggedIn`.
- A variant only overrides the args (or MSW handlers) that differ from `meta`.

```tsx
// ✅ distinct states
export const Default: Story = {};
export const OneChild: Story = { args: { promoblocks: [singlePromoblock] } };

// ❌ one story per prop value
export const ColorCherry: Story = { args: { color: 'cherry' } };
export const ColorBlueberry: Story = { args: { color: 'blueberry' } };
```

---

## 7. Decorators and providers

Decorators are defined **locally in the story file** (there are no shared decorator modules). Reuse the existing shapes:

```tsx
const rootReducer = combineReducers({
  language: createLanguageReducer([LanguageLocales.NORWEGIAN]),
  [tjenesteTeksterApi.reducerPath]: tjenesteTeksterApi.reducer,
  [resourcesApi.reducerPath]: resourcesApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(tjenesteTeksterApi.middleware).concat(resourcesApi.middleware),
});

const withProvider: Decorator = Story => (
  <Provider store={store}>
    <Story />
  </Provider>
);

const withRouter: Decorator = Story => {
  const router = createMemoryRouter([{ path: '/', element: <Story /> }]);
  return <RouterProvider router={router} />;
};

const withPageRoot: Decorator = Story => (
  <PageRoot noBreadcrumb noDriftspanel enableSurveys={false}>
    <Story />
  </PageRoot>
);
```

- Only include reducers/middleware the component actually needs.
- Decorator order matters: `decorators: [withPageRoot, withProvider, withRouter]` — the **last** one is outermost.
- Good references: `framework/src/prosesshjelp/components/helptrigger/helptrigger.stories.tsx`,
  `framework/src/language-picker/language-picker.stories.tsx`, `framework/src/entry-pageroot/tjenestecontent/tjenestecontent.stories.tsx`.
- Layout: readers toggle grid/full-width in the toolbar. Set `parameters: { layout: … }` only if a component must always be full-width.

---

## 8. MSW — mocking API responses

Storybook runs against `window.HN.Rest.*` = `helsenorge-mas-01` / `tjenester-hn-mas-01`. Requests that are not mocked go to the real server
(`onUnhandledRequest: 'bypass'`).

### When to mock

Mock a request when **any** of these apply:

1. **It can't be fetched from `https://helsenorge-mas-01.int-hn.nhn.no`** — e.g. `tjenester-hn-mas-01` / `*/proxy/*` APIs that need a
   logged-in user, external services, or endpoints that don't exist on mas-01.
2. **The story depends on specific data** that may change on the live server — e.g. hjelpetekster from `*/contentapi/internal/v2/tjeneste`
   (the story needs `hjelpetekstId: 'hjelpetekstid'` to exist), specific search hits, specific resource texts. A story that silently renders
   nothing because CMS content changed is worse than a mocked one.
3. **The story shows a state the server won't produce on demand** — error (`500`), empty list, slow loading.
4. **It changes data** — always mock `POST`, `PUT`, `PATCH` and `DELETE`, even when the endpoint is reachable (e.g. feedback submission in
   `framework/feedback/utils/api.ts`). Unmocked requests go to the shared MAS environment (`onUnhandledRequest: 'bypass'`).

Otherwise **use live data** from `helsenorge-mas-01` (typically CMS content API, `GET` only) so the story reflects reality.

### Where to put handlers — per story or per meta

Use the `beforeEach({ msw })` hook from `msw-storybook-addon`. Put it on `meta` when all stories in the file need it, or on a single story
when only that story needs it:

```tsx
import { delay, http, HttpResponse } from 'msw';

export const Default: Story = {
  beforeEach({ msw }) {
    msw.use(
      http.get('*/proxy/verktoynetcore/api/v1/SelvstendigVerktoy/*', async () => {
        await delay();

        return HttpResponse.json(selvstendigVerktoyMock);
      })
    );
  },
};

export const Error: Story = {
  beforeEach({ msw }) {
    msw.use(http.get('*/proxy/verktoynetcore/api/v1/SelvstendigVerktoy/*', () => new HttpResponse(null, { status: 500 })));
  },
};
```

- Use `*/path` wildcard URLs so the handler works regardless of host.
- `await delay()` for realistic loading states.
- Response bodies go in `__mocks__/` when large, typed with the package's entity types.
- Handlers are reset between stories automatically — no cleanup needed.
- Only add to the **global** handlers in `.storybook/preview.tsx` when the same mock is needed by many stories across packages (as with
  `*/contentapi/internal/v2/tjeneste` today). Don't move existing global handlers unless asked.
- Do **not** mock via `vi.mock`, by overwriting `window.fetch`, or by editing `window.HN` — always MSW.

---

## 9. Maintenance

When changing a component, keep its story in sync in the same change:

- **Prop added** → add it to `args` (and `argTypes` if it's a union). **Prop removed/renamed** → update args; TypeScript (`satisfies Meta`)
  will flag stale args.
- **New visual state** → consider a variant (section 6), not a new file.
- **Component moved/renamed** → move/rename the story file and update `title`. Note that changing `title` changes the story URL.
- **Component deleted** → delete its story and any `__mocks__` only used by it.
- **API shape changed** → update MSW mock bodies (typed fixtures will fail typecheck).
- **New package with stories** → add its glob to `.storybook/main.ts`.

---

## 10. Verification

Run these from the repo root.

1. **Typecheck + lint the package** you changed:
   ```sh
   npm run typecheck -w @helsenorge/core-cms
   npm run eslint -w @helsenorge/core-cms
   ```
2. **Build dependencies if needed.** Stories import their own package via relative paths (source), but **other** `@helsenorge/*` packages
   resolve to their built `lib/`. If you changed code in another package that the story imports, build it first:
   `npm run build -w @helsenorge/core-utils` (or `npm run build:packages`).
3. **Storybook build** (catches broken imports/compile errors across all stories). The `step` docs must be built first, since `main.ts`
   serves `step/dist` as a static dir:
   ```sh
   npm run -w @helsenorge/step build:documentation
   npm run build:documentation -w storybook-documentation
   ```
   Expect `Storybook build completed successfully`. The "chunks larger than 500 kB" warning is normal.
4. **Dev smoke test** — start the dev server in the background (async shell, keep it attached), then render the stories you touched:
   ```sh
   npm start -w storybook-documentation   # prestart builds step docs; serves http://localhost:3000
   ```
   - List story ids: `curl -s http://localhost:3000/index.json` (ids look like `helsenorge-core-cms-blocks-image--default`).
   - Render each new/changed story with **playwright-cli**. The repo has Playwright installed (root `node_modules`), so if `playwright-cli`
     isn't on PATH use the local version: `npx --no-install playwright cli <command>`.
   - **Command reference:** if the `playwright-cli` skill is available, load it. If not, read the copy bundled with the repo's Playwright at
     `node_modules/playwright-core/lib/tools/skills/playwright-cli/SKILL.md` (always present after `npm install`), and suggest that the user
     installs the skill for future sessions by copying it to their personal skills folder:
     ```sh
     mkdir -p ~/.copilot/skills && cp -r node_modules/playwright-core/lib/tools/skills/playwright-cli ~/.copilot/skills/
     ```
     Don't run `playwright cli install --skills` in the repo root — it also writes workspace files (`.agents/`, `.playwright/`) that
     shouldn't be committed.
   - Use `--browser=chromium` (the default `chrome` channel is usually not installed on Linux/WSL). If the browser is missing, run
     `npx --no-install playwright cli install-browser chrome-for-testing` once.
     ```sh
     playwright-cli open --browser=chromium "http://localhost:3000/iframe.html?id=<story-id>&viewMode=story"
     playwright-cli snapshot                 # the rendered content should be visible and correct
     playwright-cli console error            # no errors besides the harmless favicon.ico 404
     playwright-cli eval "document.body.classList.contains('sb-show-errordisplay')"   # must be false
     playwright-cli close
     ```
   - For MSW stories, confirm the snapshot shows the **mocked** data (and not live data or an error).
   - Stop the dev server when done (`stop_bash` / `kill <PID>`), and delete the `.playwright-cli/` output folder.

---

## 11. Audit — finding missing stories and incomplete args

When asked to audit (a package or the whole repo):

1. **List candidates**: for each package in `main.ts`, take `package.json` `exports` that point to React components (folders with
   `index.tsx`). Quick list of component folders without a story file:
   ```sh
   cd npm/packages
   for p in autosuggest cms data-table file-upload filter framework framework-utils microweb pdf-preview step; do
     find $p/src -name index.tsx -not -path '*/__*' | while read f; do d=$(dirname $f); ls $d/*.stories.tsx >/dev/null 2>&1 || echo $d; done
   done
   ```
2. **Classify** each as _needs story_ or _skip — covered by `<parent story>`_ (section 2), or _skip — internal/not exported_.
3. **Check args completeness** for each existing story: compare the props interface with `meta.args` + `argTypes`. Report missing required
   props, missing user-visible optional props, callbacks without `fn()`, and empty `argTypes: {}`.
4. **Check data dependencies**: stories whose components fetch data — note whether they rely on live mas-01 data that could change, or hit
   endpoints that need MSW (section 8).
5. **Check variants**: components with obvious states (error/empty/loading/variants) but only a `Default` story.
6. **Report** as a Markdown table per package with columns: Component · Status (missing / incomplete args / needs MSW / needs variant /
   skip) · Details · Suggested action. Don't change stories during an audit unless asked.
