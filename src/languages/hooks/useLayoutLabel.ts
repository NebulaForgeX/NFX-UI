/**
 * 返回 { getLayoutDisplayName }，便于扩展；getLayoutDisplayName 可传给 SlideDownSwitcher 的 getDisplayName。
 * Returns { getLayoutDisplayName } for extensibility; pass to SlideDownSwitcher getDisplayName.
 */
import type { LayoutModeEnum } from "@/designs/layouts/types";

import { useCallback, useMemo } from "react";

import i18n from "../languages/i18n";

function getLayoutDisplayNameImpl(mode: LayoutModeEnum): string {
  return i18n.t("layoutSwitcher." + mode, { ns: "layout", defaultValue: mode });
}

export function useLayoutLabel(): { getLayoutDisplayName: (mode: LayoutModeEnum) => string } {
  const getLayoutDisplayName = useCallback(getLayoutDisplayNameImpl, []);
  return useMemo(() => ({ getLayoutDisplayName }), [getLayoutDisplayName]);
}

export { getLayoutDisplayNameImpl as getLayoutDisplayName };
