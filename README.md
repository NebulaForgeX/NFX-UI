# NFX-UI

Unified frontend UI library for the NFX product family: shared React components, design tokens, theme variables, and layout primitives for a consistent look and behavior across NFX console and other apps.

**Tech:** React 18/19 · TypeScript · Vite (library build)

---

## 外部项目如何使用 / How to use in your app

### 1. 安装 Install

**方式 A：发布到 npm 后**

```bash
npm install nfx-ui
```

**方式 B：本地开发调试（未发布时）**

```bash
# 在 NFX-UI 目录
cd /path/to/NFX-UI
npm run build
npm link

# 在你的项目目录
cd /path/to/your-app
npm link nfx-ui
```

### 2. 依赖要求 Peer dependencies

你的项目里需要已安装：

- `react`、`react-dom`（^18.0.0 或 ^19.0.0）

若用到了主题/图表等，可能还需要按需安装：`lucide-react`、`recharts`、`@tanstack/react-query` 等（见 NFX-UI 的 `package.json` dependencies）。

### 3. 在代码里使用 Usage

**只需从 `nfx-ui` 引入组件或类型，无需单独引入 CSS**（样式已内联进库）：

```tsx
// 组件 + 类型，一次 import 即可，自带类型提示
import {
  Button,
  Input,
  ThemeProvider,
  LanguageProvider,
  type LanguageEnum,
  type ApiErrorBody,
} from "nfx-ui";

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Button>确定</Button>
        <Input placeholder="请输入" />
      </LanguageProvider>
    </ThemeProvider>
  );
}
```

- **组件**：直接使用，有 props 类型提示。  
- **类型**：`import type { ... } from "nfx-ui"` 即可。  
- **样式**：不用再写 `import "nfx-ui/dist/xxx.css"`。

---

## Install (summary)

In your app (NFX Console, Sjgz-Admin, etc.):

```bash
npm install nfx-ui
```

**Peer dependencies:** `react` and `react-dom` (^18.0.0 or ^19.0.0). Your project must have them installed.

---

## Usage (examples)

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
