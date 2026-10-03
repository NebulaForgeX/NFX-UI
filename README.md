# NFX-UI

[English](README.en.md)

<div align="center">
  <img src="image.png" alt="NFX-UI" width="200">
</div>

NebulaForgeX 的共享 React 库：主题、语言、登录和资料 hooks、axios 客户端。**不是**独立站点，也没有自己的端口。宿主是 Identity、Edge、News、Storages、Documentation 的 console。不含 LSR / PQTTEC / SJGZ。

当前 **0.36.0**，由 GitHub Actions 在 `main` 上发布到 npm。五个宿主的 `package.json` 都精确钉 `"nfx-ui": "0.36.0"`。不要写 `^` 或 `~`。不要和 `"nfx-ui": "file:../../NFX-UI"` 同时存在。改了 hooks、枚举、主题或类型之后：升版本，push `main`，等几分钟确认 `npm view nfx-ui@<版本> version` 已经有了，再把**每一个**宿主改到同一个版本并 `npm install`。不要在本地 `npm publish`。

## 宿主可以 import 的

`nfx-ui/providers`：`ThemeProvider`、`LanguageProvider`、`DataProvider`。主题只读 preference store。`ThemeProvider` 没有 `defaultTheme` 这种覆盖参数。样式：

```ts
import "nfx-ui/themes/index.css";
import "nfx-ui/themes/fonts";
```

`nfx-ui/navigations`：`GuestRoute`、`ProtectedRoute`。Identity 的 Forger / Authority 分树是 Identity console 自己的 `ScopeRoute`，不在这个库里。

`nfx-ui/hooks`：登录、注册、选资料、改资料、邮箱、手机、密码、头像、asset 上传，以及 `useUnifiedQuery` / `useUnifiedInfiniteQuery`。页面只准走这些 hooks，不要在页面里 import axios 或 `useAuthRepository`。`ProfileKindEnum` 是 `COMMUNITY = "community"` 和 `AUTHORITY = "authority"`。

列表失效不在这个库里。宿主用自己的 `@/events/invalidate`（`invalidateEventEmitter` + `useInvalidateInv`）。库内是 `authEventEmitter` 和 `queryEventEmitter`。页面不要直接 `useQueryClient().invalidateQueries`。

没有 `nfx-ui/layouts`、`LayoutFrame`、`PageFrame`、`ModalProvider`。`nfx-ui/elements` 是空的 `export {}`。`nfx-ui/icons` 实际指向 `src/animations`。壳层用宿主自己的 Sidebar，加上对等依赖 `@radix-ui/themes`。弹层用 Radix `Dialog`，挂在各仓自己的 `ModalProvider` 上。

其它子路径：`apis`、`apis/repositories`（只给 hooks 和 DataProvider）、`config`、`constants`、`enums`、`events`、`languages`、`schemas`、`stores`、`themes`、`types`、`utils`。

## 对等依赖

`react` / `react-dom` `^19.3.0`，`react-router` `^8.4.0`，`@radix-ui/themes` `^3.3.0`，`@tanstack/react-query` `^5.103.1`，`axios` `^1.20.0`。`vite` 不是 peer，构建用 devDependency `^8.3.0`。

Console 颜色用 Radix token：`--gray-*`、`--accent-*`、`--color-background`、`--color-panel-solid`。新样式不要依赖 `themes/index.css` 里留给旧宿主的 `--color-primary` 一类别名。

```bash
npm install
npm run build
npm run typecheck
```

详细信息见 [NFX-Documentation 第七章](https://github.com/NebulaForgeX/NFX-Documentation/blob/main/books/zh/chapter-07-nfx-ui.md)。
