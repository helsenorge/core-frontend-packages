---
name: migration-guide
description:
  Generate or update Norwegian-language migration guides for major version bumps of internal frontend packages by comparing a feature branch
  against master. Use this skill whenever the user wants to create a migration guide, document breaking changes between branches, prepare
  migration notes for core-pakker / Frankenstein / Helsenorge package upgrades, or translate git diffs and CHANGELOGs into wiki-ready
  migration documentation with both human summaries and agent-runnable prompts. Triggers on phrases like "make migration guide", "lag
  migreringsguide", "document breaking changes", "compare feature/core-vXX to master", "write migration notes for v39", or any context
  involving a major version bump of internal @helsenorge/* packages.
---

# Migration guide generator

This skill produces wiki-ready migration guides (in Norwegian) for major version bumps of internal frontend packages in monorepos like
Helsenorge. The output is meant to be pasted into Confluence and to drive both human readers and coding agents working in downstream
consumer codebases.

The defining design constraint: not every consumer uses every package. Each entry must include an applicability check so an agent can
paste-and-go in any consumer repo and self-skip when the change is irrelevant.

## When in doubt

If you trigger this skill but the user's actual request is something narrower (e.g. "summarize the changes in this branch" without wiki
output), confirm before producing the full guide. The output is opinionated and Norwegian — make sure that's what they want.

## Step 1: Gather inputs

You need:

- **Feature branch name** (e.g. `feature/core-v39`). Required.
- **Existing migration guide path** (optional). If the user is updating a partially-written guide, they should hand you the markdown file or
  paste the contents.
- **Target output path** (optional). Default: `migration-guide-<sanitized-branch>.md` in the current directory, where slashes in the branch
  name become hyphens.

If the feature branch isn't obvious from context, ask. If you see a partial guide in the conversation or as an attachment, treat that as the
existing guide.

## Step 2: Discover changes

Run in this order:

1. `git fetch origin --quiet`
2. `git log --no-merges --oneline origin/master..origin/<branch>` — commit overview.
3. `git diff --name-only origin/master..origin/<branch> | grep -E "^packages/[^/]+/" | awk -F/ '{print $1"/"$2}' | sort -u` — changed
   packages.

For each changed package, gather signals in order of trustworthiness:

- **`<pkg>/CHANGELOG.md` diff** — primary source when present.
- **`<pkg>/package.json` diff** — version bump (major = breaking signal) and dep changes.
- **Deleted files** — `git diff --diff-filter=D --name-only origin/master..origin/<branch> -- <pkg>`.
- **Public API surface** — diff the `exports` field in `<pkg>/package.json` for removed or renamed entry points (the codebase uses subpath
  exports per feature, not barrel files, so each removed key is a removed public surface). For deeper signal on a specific entry, diff its
  `./lib/<name>/index.js` source.
- **Commit messages** — `git log --no-merges --pretty=format:"%h %s%n%b" origin/master..origin/<branch> -- <pkg>` when CHANGELOG is thin.
- **Targeted file diffs** — only when you suspect a breaking change you can't otherwise confirm.

Be efficient. Don't load the full package diff. Follow signals.

## Step 3: Classify each change

Each candidate fits one of:

- **Removed export** — component, hook, util, or constant deleted (usually with a replacement).
- **Renamed export** — same functionality, new name.
- **Changed API** — modified signature, prop name, parameter, or return type.
- **Changed default** — a prop or config default flipped (e.g. `false` → `true`).
- **Required config change** — consumer must touch their own files (`index.html`, `vite.config.ts`, `package.json`, YML pipelines, etc.).
- **Dependency upgraded** — major bump of a peer-dep or build tool. Often informational, but mention it.
- **Removed tooling** — script, CLI command, or build step removed.

Skip pure internal changes (refactors with no API change, lint fixes, test improvements). They don't belong in a migration guide.

## Step 4: Reconcile with existing guide

If the user gave you an existing guide, read it and mark which changes are already documented. **Verify every factual claim in every
existing entry against your own diff analysis.** Correct errors and outdated information — do not assume an existing guide is correct. Keep
style and structure only where the facts check out. Merge in what's missing.

## Step 5: Write each entry

Each entry has three parts.

### h2 heading

Short, scannable, natural Norwegian. No `BREAKING:` prefix. Match the style of existing entries (e.g. "HelpTooltip er fjernet",
"Spørreundersøkelser er default på", "Vite 8").

### Human summary

2–5 sentences in Norwegian explaining what changed and why it matters. Include before/after code snippets when relevant — especially for
config changes in `index.html`, `package.json`, and pipelines. Link to external guides (Vite migration docs, official TypeScript release
notes, etc.) where natural. Internal links (Confluence, intranet HOW-TO-er) are acceptable in human summaries since a human reader can
access them — but never include them in agent prompts.

### Agent prompt

A copyable prompt for an agent working in a downstream consumer codebase. Wrap in a code block. The prompt must:

1. **Start with an applicability check.** Does this codebase use the affected package/export/config? If not → skip and note it in the PR
   description. This is the most important part — it's what makes the prompt safe to paste into any consumer repo.
   - For `vite.config.ts` changes: all consumer projects have this file, but they may only re-export the base config without local
     overrides. The check must look for the specific customization (e.g. `rollupOptions`, `tsconfigPaths`) — not just file existence.
2. **Describe search patterns without naming specific tools** — describe _what_ to search for (string, file type, pattern) and let the
   executing agent choose its own search tool. Do not name tools like `rg`, `ripgrep`, `grep`, `fd`, or `find`. Example: instead of
   `rg "HelpTooltip" --type tsx`, write "søk etter 'HelpTooltip' i TypeScript/TSX-filer".
3. **Search all usage sites, not just imports** — tests and setup files may interact with the affected API directly without importing it
   (e.g. `window.HN.Commands.GetFeatureToggles = {...}` in test setup). Agent prompts must include search patterns for both import-based
   usage AND direct references to the underlying data structures or global variables involved.
4. **Describe the transformation** — what to replace, how props/types map. Tell the agent to read TypeScript types when mapping isn't 1:1,
   not to guess.
5. **Include MSW mock implications for default-value changes** — when a changed default causes new code to run unconditionally (e.g. a
   component that now renders and fires API calls by default), the prompt must include a step for adding or updating MSW handlers for any
   new endpoints that would now be called in tests. Describe the endpoint pattern concretely.
6. **Specify verification** — tell the agent to read the `scripts` field in `package.json` and use whichever script runs type-checking and
   tests in that project. Do not hardcode `npm run typecheck` or `npm test` — these names vary across consumer codebases.
7. **Only link to publicly accessible pages** — agents cannot access Confluence, intranet HOW-TO-er, or other internal resources. Only
   reference public documentation (official Vite migration guide, TypeScript release notes, etc.).
8. **Specify what goes in the PR description** — especially for skipped changes.

The prompt must be in Norwegian and self-contained — an agent should be able to act on it without reading the rest of the guide.

## Example entry

````markdown
## HelpTooltip er fjernet

`HelpTooltip` er slettet fra `@helsenorge/core-framework`. Bruk `DictionaryBubble` som erstatning. Propsene er ikke 1:1 — sjekk komponentens
TypeScript-typer for å mappe riktig.

### Agent-prompt

```
Migrer fra HelpTooltip til DictionaryBubble.

1. Sjekk om kodebasen bruker HelpTooltip:
   Søk etter 'HelpTooltip' i TypeScript/TSX-filer.
   Hvis ingen treff: hopp over dette steget og noter i PR-beskrivelsen at
   HelpTooltip ikke er i bruk.

2. For hvert treff:
   - Endre import fra `HelpTooltip` til `DictionaryBubble` (samme pakke,
     @helsenorge/core-framework).
   - Bytt JSX-tagnavnet.
   - Mapp props ved å lese DictionaryBubble sine TypeScript-typer i
     node_modules/@helsenorge/core-framework. Ikke gjett — verifiser.

3. Verifiser:
   - Les scripts-feltet i package.json og finn riktig navn på typecheck-
     og test-scriptene i dette prosjektet. Kjør dem.

4. I PR-beskrivelsen: lim inn liste over filer du endret, eller skriv
   "HelpTooltip ikke i bruk" hvis ingen treff.
```
````

## Step 6: Add the super-agent-prompt preamble

Immediately after the h1 title, insert a blockquote that serves as both a human explanation and a top-level instruction for any agent that
receives the entire guide as input. The preamble must:

- Explain the structure of the guide for humans (human summaries + agent-prompts).
- Include a **dependency-update step (steg 0)** that the agent must complete before following any per-section prompts. See below.
- Instruct agents to work through all remaining sections in order, follow each agent-prompt, and start every section with the applicability
  check.

### Dependency-update step in the preamble

The Helsenorge ecosystem has two distinct package families with different version schemes:

1. **Core packages** — all packages in `npm/packages/` of this monorepo (excluding `storybook-documentation` which is not published). Derive
   the authoritative list at guide-generation time by running:
   `for d in npm/packages/*/; do node -e "const p=require('./$d/package.json'); if(p.name?.startsWith('@helsenorge/')) console.log(p.name)" 2>/dev/null; done`
   These are versioned together and covered by this guide.
2. **Designsystem packages** — `@helsenorge/designsystem-react` and related packages (e.g. `@helsenorge/lightbox`,
   `@helsenorge/datepicker`). These follow a separate version scheme and may have their own beta for the next major.

Consumers may also depend on other `@helsenorge/*` packages not in either list above — those are outside the scope of this guide.

When the new major is not yet released (only available as a beta), the preamble must tell the agent to:

1. List all `@helsenorge/*` packages in `package.json`.
2. For each, identify which family it belongs to.
3. Use `npm dist-tag ls <package>` to find the current `beta` dist-tag for that family.
4. **Present the full update plan to the user and wait for confirmation** before touching `package.json` or running installs. Dependency
   updates can cause conflicts that are hard to resolve automatically.
5. After confirmation: apply the version bumps and run `npm install`. Resolve any peer-dependency errors before proceeding.
6. Only continue with the per-section prompts once `npm install` succeeds.

### Preamble template

Adapt version number, package names, and beta versions based on what you found in the branch:

````markdown
> Denne guiden beskriver endringer i v39 av Helsenorge core-pakker. Hver seksjon inneholder en menneskelig beskrivelse av hva som er endret,
> og en **agent-prompt** med konkrete instrukser for å utføre migreringen.
>
> **For agenter — steg 0, gjør dette før alt annet:**
>
> ```
> Oppdater @helsenorge-pakker til riktige versjoner.
>
> 1. List alle @helsenorge-pakker i package.json:
>    rg '"@helsenorge/' package.json
>
> 2. Kategoriser pakkene:
>    - Core-pakker (autosuggest, core-build, core-cms, core-framework,
>      core-utils, data-table, eslint-config, file-upload, filter,
>      framework-utils, library-build, microweb, pdf-preview, step):
>      finn siste beta: npm dist-tag ls @helsenorge/core-framework
>      Oppdater alle til samme beta-versjon (f.eks. 39.0.0-beta.0).
>    - Designsystem-pakker (designsystem-react, lightbox, datepicker, osv.):
>      finn siste beta: npm dist-tag ls @helsenorge/designsystem-react
>      Oppdater til beta hvis tilgjengelig. Behold gjeldende versjon hvis ikke.
>    - Andre @helsenorge-pakker som ikke er nevnt over:
>      ikke oppdater disse — de er utenfor scope for denne migreringen.
>
> 3. Presenter oppdateringsplanen for brukeren og vent på godkjenning
>    før du endrer noe i package.json.
>
> 4. Etter godkjenning: oppdater versjonsnumre i package.json og kjør
>    npm install. Løs eventuelle peer dependency-konflikter.
>    Ikke gå videre til neste steg før npm install er vellykket.
> ```
>
> **Steg 1 og utover:** Gå gjennom alle seksjoner i rekkefølge. For hver seksjon: følg instruksene i agent-prompten nøyaktig. Start alltid
> med applicability-sjekken — hopp over seksjoner som ikke er relevante for dette prosjektet, og noter det i PR-beskrivelsen.
````

## Step 7: Order the guide

Roughly: breaking API changes → default-value changes → required config changes → dependency / tooling changes (informational) at the end.
If the existing guide has its own order, respect it.

## Step 8: Write and summarize

Write the guide to the output path. Then summarize briefly in chat:

- Number of entries (new + carried over).
- Changes you found but were unsure how to classify — list them so the user can decide.
- Existing entries you preserved unchanged.
- Output file path.

Don't paste the full guide back into chat unless the user asks. They'll read the file.
