# NFX-UI — Unified Frontend UI Library  
# NFX-UI — 统一前端 UI 库

**NFX-UI = NebulaForgeX UI Library**  
**NFX-UI = NebulaForgeX 前端 UI 库**

<div align="center">
  <img src="./docs/image1.png" alt="NFX-UI Logo" width="200">
</div>

**English:**  
**NFX-UI** is the shared frontend UI library of the NebulaForgeX ecosystem. It provides React components, design tokens, theme system, layout primitives, i18n, and utilities for a consistent look and behavior across NFX Console and other applications. Built with **React 18/19**, **TypeScript**, and **Vite** (library mode), NFX-UI is distributed as ESM/CJS with inlined styles and full type definitions—no separate CSS import required.

**中文：**  
**NFX-UI** 是 NebulaForgeX 生态的统一前端 UI 库，提供 React 组件、设计令牌、主题系统、布局基元、多语言与工具函数，为 NFX 控制台及其他应用提供一致的外观与交互。基于 **React 18/19**、**TypeScript** 与 **Vite**（库模式）构建，以 ESM/CJS 发布，样式内联、类型完整，使用方无需单独引入 CSS。

---

## 外部项目如何使用 / How to use in your app

### 1. 安装 / Install

**中文：**  
- **方式 A**：发布到 npm 后，在业务项目中执行 `npm install nfx-ui`。  
- **方式 B**：未发布时，在 NFX-UI 目录执行 `npm run build` 与 `npm link`，在业务项目目录执行 `npm link nfx-ui`。

**English:**  
- **Option A:** After publishing to npm, run `npm install nfx-ui` in your app.  
- **Option B:** When unpublished, run `npm run build` and `npm link` in NFX-UI, then `npm link nfx-ui` in your app.

```bash
# 方式 A / Option A
npm install nfx-ui

# 方式 B / Option B（在 NFX-UI 目录 / in NFX-UI）
npm run build && npm link
# 在业务项目 / in your app
npm link nfx-ui
```

### 2. 依赖要求 / Peer dependencies

**中文：**  
你的项目需已安装 `react`、`react-dom`（^18.0.0 或 ^19.0.0）。若使用主题、图表等，可能还需按需安装 `lucide-react`、`recharts`、`@tanstack/react-query` 等（见 `package.json`）。

**English:**  
Your project must have `react` and `react-dom` (^18.0.0 or ^19.0.0). For themes, charts, etc., you may need `lucide-react`, `recharts`, `@tanstack/react-query` (see `package.json`).

### 3. 在代码里使用 / Usage

**中文：**  
只需从 `nfx-ui` 引入组件或类型，无需单独引入 CSS。组件直接使用即有 props 类型提示；类型通过 `import type { ... } from "nfx-ui"` 获取；样式已内联，无需 `import "nfx-ui/dist/xxx.css"`。

**English:**  
Import components or types from `nfx-ui`; no separate CSS import. Components have typed props; use `import type { ... } from "nfx-ui"` for types; styles are inlined.

```tsx
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
        <Button>确定 / Confirm</Button>
        <Input placeholder="请输入 / Enter" />
      </LanguageProvider>
    </ThemeProvider>
  );
}
```

---

## 包含模块 / What’s included

**中文：**  
下表为包内主要模块与内容；完整组件与 API 见 [docs/](./docs/)。

**English:**  
Main modules and contents below; full component and API docs: [docs/](./docs/).

| 模块 Module   | 内容 Contents |
|---------------|----------------|
| **themes**    | ThemeProvider、ThemeSwitcher、主题变量 / Theme vars |
| **languages** | LanguageProvider、i18n、LanguageSwitcher |
| **layouts**   | LayoutProvider、Sidebar、Header、Footer、Background |
| **components**| Button、Input、Dropdown、Slider、VirtualList 等 / etc. |
| **animations**| WaveBackground、ECGLoading、TruckLoading、BounceLoading 等 / etc. |
| **hooks**     | makeUnifiedQuery、makeUnifiedInfiniteQuery、makeCursorFetchFunction |
| **preference**| 用户偏好 / User preference (e.g. profile.preference) |
| **types**     | 共享 TypeScript 类型 / Shared types |
| **utils**     | 地址、电话、价格、时间、Result、retry 等 / Helpers |
| **constants** | Query key 工厂、defineEnum 等 / Query keys, defineEnum |

---

## 本仓库开发 / Development (this repo)

### 安装依赖 / Setup

**中文：**  
本仓库为纯库，无 dev 服务器或 demo，需在真实应用中通过 `npm link` 测试。克隆后执行 `npm install` 安装依赖。

**English:**  
This repo is library-only: no dev server or demo; test via `npm link` in a real app. Run `npm install` after clone.

```bash
npm install
```

### 构建 / Build

**中文：**  
执行 `npm run build`，产物在 `dist/`：ESM（index.mjs）、CJS（index.cjs）、类型（index.d.ts），样式已内联。

**English:**  
Run `npm run build`. Output in `dist/`: ESM, CJS, and `.d.ts`; styles inlined.

```bash
npm run build
```

### 本地联调 / Test locally (npm link)

**中文：**  
1. 在 NFX-UI 目录执行 `npm run link`。  
2. 在消费项目中执行 `npm link nfx-ui`。  
3. 修改 NFX-UI 后需在 NFX-UI 目录再次执行 `npm run build` 才能生效。

**English:**  
1. In NFX-UI: `npm run link`.  
2. In your app: `npm link nfx-ui`.  
3. After changing NFX-UI, run `npm run build` in NFX-UI again.

### 代码检查与格式化 / Lint & format

**中文：**  
`npm run lint` 运行 ESLint；`npm run lint:code-format` 检查 Prettier；`npm run format` 执行 Prettier 格式化。

**English:**  
`npm run lint` for ESLint; `npm run lint:code-format` for Prettier check; `npm run format` for Prettier write.

```bash
npm run lint
npm run lint:code-format
npm run format
```

---

## 项目结构 / Project structure

**中文：**  
`src/` 下为入口与各模块；本仓库内使用路径别名 `@/`（指向 `src/`）。

**English:**  
`src/` contains entry and modules; path alias `@/` (points to `src/`) is used in this repo.

```
src/
├── index.ts        # 包入口 / Package entry
├── languages/      # i18n、LanguageProvider、LanguageSwitcher
├── themes/         # ThemeProvider、ThemeSwitcher、主题数据 / theme data
├── layouts/        # LayoutProvider、Sidebar、Header、Footer
├── components/     # Button、Input、Dropdown、…
├── animations/     # WaveBackground、loaders
├── hooks/          # Query、form、layout hooks
├── preference/     # 用户偏好 / User preference
├── types/          # 共享类型 / Shared types
├── utils/          # 工具函数 / Helpers
└── constants/      # Query keys、枚举等 / Query keys, enums
```

---

## License 许可证

**中文：**  
UNLICENSED（仅内部使用）。若对外发布请在 `package.json` 中修改许可证。

**English:**  
UNLICENSED (private use). Change the license in `package.json` if you publish.
