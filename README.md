# NFX-UI

Unified frontend UI library for the NFX product family: shared React components, design tokens, theme variables, and layout primitives for a consistent look and behavior across NFX console and other apps.

**Tech:** React 18/19 · TypeScript · Vite (library build)

---

## Install

In your app (NFX Console, Sjgz-Admin, etc.):

```bash
npm install nfx-ui
```

**Peer dependencies:** `react` and `react-dom` (^18.0.0 or ^19.0.0). Your project must have them installed.

---

## Usage

```ts
// Single entry
import {
  Button,
  ThemeProvider,
  LayoutFrame,
  LanguageProvider,
  LanguageEnum,
  WaveBackground,
} from "nfx-ui";

// Or named imports (tree-shaking friendly)
import { ThemeProvider } from "nfx-ui";
import { LayoutFrame } from "nfx-ui";
import { LanguageProvider, getLocalLanguage } from "nfx-ui";
```

Wrap your app with providers as needed:

```tsx
<ThemeProvider>
  <LanguageProvider>
    <LayoutFrame>
      {/* your app */}
    </LayoutFrame>
  </LanguageProvider>
</ThemeProvider>
```

---

## What’s included

| Module       | Contents                                      |
|-------------|-----------------------------------------------|
| **themes**  | ThemeProvider, theme switcher, theme vars     |
| **languages** | LanguageProvider, i18n, language switcher   |
| **layouts** | LayoutFrame, sidebar, header, footer          |
| **components** | Button, Input, Dropdown, etc.              |
| **animations** | WaveBackground, loaders, motion helpers   |
| **hooks**   | Query, form, layout hooks                     |
| **preference** | User preference (e.g. profile.preference) |
| **types**   | Shared TypeScript types                       |
| **utils**   | Helpers (phone, retry, etc.)                  |
| **constants** | Query keys, shared constants               |

---

## Development (this repo)

This repo is **library-only**: no dev server or demo app. Build and test via link in a real app.

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

Output: `dist/` (ESM `index.mjs`, CJS `index.cjs`, and `.d.ts`).

### Test locally (npm link)

1. In **NFX-UI**:  
   `npm run link`
2. In your **consumer app**:  
   `npm link nfx-ui`
3. Run the app’s dev server; changes in NFX-UI need `npm run build` in NFX-UI to be reflected.

### Lint & format

```bash
npm run lint             # ESLint
npm run lint:code-format  # Prettier check
npm run format           # Prettier write
```

---

## Project structure

```
src/
├── index.ts        # Package entry (re-exports below)
├── languages/      # i18n, LanguageProvider, LanguageSwitcher
├── themes/         # ThemeProvider, ThemeSwitcher, theme data
├── layouts/        # LayoutFrame, Sidebar, Header, Footer
├── components/     # Button, Input, Dropdown, …
├── animations/     # WaveBackground, loaders
├── hooks/          # Query, form, layout hooks
├── preference/     # User preference
├── types/          # Shared types
├── utils/          # Helpers
└── constants/      # Query keys, etc.
```

Inside this repo, use path alias `@/` (points to `src/`) for imports.

---

## License

UNLICENSED (private use). Change in `package.json` if you publish under a different license.
