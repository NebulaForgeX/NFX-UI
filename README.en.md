# NFX-UI

[中文](README.md)

<div align="center">
  <img src="image.png" alt="NFX-UI" width="200">
</div>

The shared React library for NebulaForgeX: theme, language, auth and profile hooks, and the axios client. It is **not** a site and it has no port of its own. Hosts are the Identity, Edge, News, Storages, and Documentation consoles. LSR / PQTTEC / SJGZ are not hosts.

Current **0.36.0**, published to npm by GitHub Actions on `main`. All five hosts pin exactly `"nfx-ui": "0.36.0"` in `package.json`. No `^` or `~`. Do not also set `"nfx-ui": "file:../../NFX-UI"`. After a hook, enum, theme, or type change: bump the version, push `main`, wait until `npm view nfx-ui@<version> version` succeeds, then pin **every** host to that same version and `npm install`. Do not `npm publish` from a laptop.

## What a host may import

`nfx-ui/providers`: `ThemeProvider`, `LanguageProvider`, `DataProvider`. Theme is read only from the preference store. `ThemeProvider` has no `defaultTheme` override. Styles:

```ts
import "nfx-ui/themes/index.css";
import "nfx-ui/themes/fonts";
```

`nfx-ui/navigations`: `GuestRoute`, `ProtectedRoute`. Identity's Forger / Authority split is Identity's own `ScopeRoute`, not this library.

`nfx-ui/hooks`: login, signup, select profile, patch profile, email, phone, password, avatar, and asset upload, plus `useUnifiedQuery` / `useUnifiedInfiniteQuery`. Pages call these hooks only. A page does not import axios or `useAuthRepository`. `ProfileKindEnum` is `COMMUNITY = "community"` and `AUTHORITY = "authority"`.

List invalidation is not in this library. The host uses its own `@/events/invalidate` (`invalidateEventEmitter` + `useInvalidateInv`). Inside the library, use `authEventEmitter` and `queryEventEmitter`. A page does not call `useQueryClient().invalidateQueries`.

There is no `nfx-ui/layouts`, `LayoutFrame`, `PageFrame`, or `ModalProvider`. `nfx-ui/elements` is an empty `export {}`. `nfx-ui/icons` resolves to `src/animations`. The shell is the host's own Sidebar plus the peer `@radix-ui/themes`. Dialogs are Radix `Dialog`, mounted by each host's own `ModalProvider`.

Other subpaths: `apis`, `apis/repositories` (hooks and DataProvider only), `config`, `constants`, `enums`, `events`, `languages`, `schemas`, `stores`, `themes`, `types`, `utils`.

## Peers

`react` / `react-dom` `^19.3.0`, `react-router` `^8.4.0`, `@radix-ui/themes` `^3.3.0`, `@tanstack/react-query` `^5.103.1`, `axios` `^1.20.0`. `vite` is not a peer. The build devDependency is `^8.3.0`.

Console colors use Radix tokens: `--gray-*`, `--accent-*`, `--color-background`, `--color-panel-solid`. New styles do not depend on the old-host aliases such as `--color-primary` inside `themes/index.css`.

```bash
npm install
npm run build
npm run typecheck
```

Full detail: [NFX-Documentation chapter 7](https://github.com/NebulaForgeX/NFX-Documentation/blob/main/books/en/chapter-07-nfx-ui.md).
