# NFX-UI

Unified frontend UI library for the NFX product family: shared React components, design tokens, theme variables, and layout primitives for a consistent look and behavior across NFX console and other apps.

## Tech Stack

- **React 18/19** + **TypeScript**
- **Vite** (library build)
- **ESLint** + **Prettier** (lint & format)

## Getting Started

### Install

```bash
npm install
```

### Build (library only, no dev server in this repo)

```bash
npm run build   # → dist/ (index.mjs, index.cjs, *.d.ts)
```

### Lint & Format

```bash
npm run lint             # ESLint
npm run lint:code-format # Prettier check
npm run format           # Prettier fix (write)
```

## How to test this package

This repo is a **library only** — there is no dev server or demo app here. Test the package in a real app:

### Option 1: npm link (recommended)

1. In **NFX-UI** (this repo):  
   `npm run build && npm link`
2. In your **consumer app** (e.g. NFX console):  
   `npm link nfx-ui`
3. Run the consumer app’s dev server and use `nfx-ui` components as usual.

### Option 2: Storybook (optional, add later)

Add Storybook in this repo to develop and preview components in isolation on one port. No need for a full demo app.

### Option 3: Unit / component tests

Add Vitest + React Testing Library and test components without any server.

## Project Structure

```
src/
├── index.ts           # 统一导出入口 / Unified package entry
├── languages/         # 多语言：类型、工具、组件、i18n
├── themes/            # 主题：类型、工具、组件、hooks、主题数据
├── layouts/           # 布局：类型、工具、组件、hooks
├── components/        # 通用 UI 组件（Button, Input, Dropdown, …）
├── animations/        # 动效与 Loading 组件
├── hooks/             # 通用 hooks（Query、表单等）
├── preference/        # 用户偏好（与后端 profile.preference 约定）
├── types/             # 全局类型
├── utils/             # 工具函数
└── constants/         # 常量（query keys 等）
```

各功能模块（如 `languages`、`themes`、`layouts`）采用统一结构：`types/`、`utils/`、`components/`（及 `hooks/` 等），由模块根目录 `index` 统一导出。

## Usage (in consumer app)

After `npm install nfx-ui` or `npm link nfx-ui`:

```ts
import { Button, ThemeProvider, LanguageEnum } from "nfx-ui";
// or tree-shake
import { ThemeProvider } from "nfx-ui";
import { LayoutFrame } from "nfx-ui";
import { LanguageProvider, getLocalLanguage } from "nfx-ui";
```

在本仓库内开发时可通过路径别名 `@/` 引用（指向 `src/`）。
