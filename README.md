# NFX-UI — Unified Frontend UI Library

**NFX-UI 1.0** is the shared frontend UI library of the NebulaForgeX ecosystem. Chrome follows **CityPulso PulsoLink-Package** (Radix Themes + `react-pro-sidebar`). Hosts compose Radix primitives themselves; NFX-UI ships theme, language, layout, modal, and preference chrome.

**NFX-UI 1.0** 是 NebulaForgeX 的共享前端 UI 库。壳层对齐 **CityPulso PulsoLink-Package**（Radix Themes + `react-pro-sidebar`）。宿主自己组合 Radix 原语；NFX-UI 提供主题、语言、布局、模态框与偏好设置壳。

Hosts: Identity, Vault, Documentation, Storages. Not LSR / PQTTEC / SJGZ.

宿主：Identity、Vault、Documentation、Storages。不含 LSR / PQTTEC / SJGZ。

---

## Install / 安装

Host apps use the local package:

宿主使用本地包：

```json
"nfx-ui": "file:../../NFX-UI"
```

Peer versions follow PulsoLink-WEB (do not `ncu` past them independently):

对等依赖版本对齐 PulsoLink-WEB（不要单独 `ncu` 越过）：

- `react` / `react-dom` `^19.2.8`
- `react-router` `^8.3.1` (not `react-router-dom`)
- `@radix-ui/themes` `^3.3.0`, `radix-ui` `^1.6.7`, `@radix-ui/react-icons` `^1.3.2`
- `lucide-react` `^1.41.0`
- `vite` `^8.2.2`, `typescript` `~6.0.3`

---

## Host bootstrap / 宿主接入

```tsx
import { LanguageEnum } from "nfx-ui/enums";
import { LanguageProvider, ThemeProvider, ModalProvider } from "nfx-ui/providers";
import { LayoutFrame, LayoutProvider, Sidebar, Header, Main, PageFrame } from "nfx-ui/layouts";
import { PreferencesPopover, ThemeSettings, PageHeader, EmptyState } from "nfx-ui/components";
import { usePreferenceStore } from "nfx-ui/stores";
import { configurePreferenceSync, useSyncPreference, useApplyPreferenceOnLoad } from "nfx-ui/hooks";
import { showInfo, showError, showSuccess, showConfirm } from "nfx-ui/stores";
import "@radix-ui/themes/styles.css";
import "nfx-ui/themes/fonts";
import "nfx-ui/themes/styles.css";

export function App() {
  return (
    <LanguageProvider getBuiltinBundles={getBuiltinI18nBundles}>
      <ThemeProvider>
        <LayoutProvider>
          <ModalProvider>
            <LayoutFrame items={menuItems}>{/* pages */}</LayoutFrame>
          </ModalProvider>
        </LayoutProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
```

- `ThemeProvider` does **not** take `defaultTheme`. Theme lives on preference: `{ accent, gray, appearance, radius, scaling, panelBackground, fontFamily }`.
- `ThemeProvider` **不再**接收 `defaultTheme`。主题在 preference 的 theme 对象上。
- Fonts: import `"nfx-ui/themes/fonts"` (source, not bundled into every lib entry).
- 字体：`"nfx-ui/themes/fonts"`（源码入口，不要打进每个 lib chunk）。
- Page chrome: `PageFrame` + `PageHeader` (`icon` is required) + Radix `Card` / `Flex` / `Button` / `TextField`.
- 页面壳：`PageFrame` + `PageHeader`（必须有 `icon`）+ Radix 原语。
- Auth screens copy PulsoLink `AuthShell`. Theme/language UI is `PreferencesPopover` / `ThemeSettings`.
- 登录页拷 PulsoLink `AuthShell`。主题/语言用 `PreferencesPopover` / `ThemeSettings`。
- Queries: `useUnifiedQuery` / `useUnifiedInfiniteQuery` from `nfx-ui/hooks` (or `nfx-ui/utils`). Pages never call axios.

```tsx
import { Button, TextField, Flex, Card } from "@radix-ui/themes";
```

---

## Modules / 模块

| Module | Contents |
|--------|----------|
| **enums** | Language, appearance, accent, radius, dashboard background |
| **providers** | ThemeProvider, LanguageProvider, ModalProvider |
| **themes** | Radix mappings, fonts, CSS |
| **languages** | i18n init, createI18nResources, labels |
| **layouts** | LayoutFrame, Sidebar (`react-pro-sidebar`), Header, Main, PageFrame, UserTopBar |
| **components** | PreferencesPopover, ThemeSettings, PageHeader, EmptyState, LucideIcon, Logo, VirtualList + Radix re-exports |
| **stores** | preference + modal (`showInfo` / `showSuccess` / `showError` / `showConfirm` / `showLoading`) |
| **hooks** | useUnifiedQuery, useSyncPreference, useApplyPreferenceOnLoad, configurePreferenceSync |
| **animations** | WaveBackground, ECGLoading, TruckLoading, … |
| **types / utils / constants** | Shared types and helpers |

`useTheme().setTheme` takes `Partial<ResolvedThemePreference>`. Preference persist key is `nfx-preference`.

---

## Development / 开发

This repo is library-only. Build with `npm run build`. Output in `dist/`. Font CSS must not be injected into every lib entry.

本仓库仅库模式。`npm run build` 输出到 `dist/`。字体 CSS 不得注入每个入口。

```bash
npm install
npm run build
npm run lint
```

Test via host `file:../../NFX-UI`. Do not modify `Example/` (CityPulso PulsoLink is source of truth only).

用宿主 `file:../../NFX-UI` 验证。不要改 `Example/`（CityPulso PulsoLink 只作对照源）。

---

## License

[MIT](LICENSE)
