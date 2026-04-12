import type { BaseTheme } from "../types";
import { useEffect } from "react";

const px = (n: number) => `${n}px`;

/**
 * 将当前基础主题（圆角、间距、字号等非颜色 token）注入到 document 的 CSS Variables。
 * Injects base theme tokens (radius, spacing, typography, etc.) as CSS custom properties on :root.
 */
const useBaseVariables = (base: BaseTheme) => {
  useEffect(() => {
    const root = document.documentElement;
    const v = base.variables;

    const r = v.radius;
    root.style.setProperty("--radius-button", px(r.button));
    root.style.setProperty("--radius-card", px(r.card));
    root.style.setProperty("--radius-input", px(r.input));
    root.style.setProperty("--radius-modal", px(r.modal));
    root.style.setProperty("--radius-badge", px(r.badge));
    root.style.setProperty("--radius-avatar", px(r.avatar));

    const sp = v.spacing;
    root.style.setProperty("--space-xs", px(sp.xs));
    root.style.setProperty("--space-sm", px(sp.sm));
    root.style.setProperty("--space-md", px(sp.md));
    root.style.setProperty("--space-lg", px(sp.lg));
    root.style.setProperty("--space-xl", px(sp.xl));
    root.style.setProperty("--space-page", px(sp.page));
    root.style.setProperty("--space-card", px(sp.card));
    root.style.setProperty("--space-section-gap", px(sp.sectionGap));
    root.style.setProperty("--space-grid-gap", px(sp.gridGap));

    const b = v.border;
    root.style.setProperty("--border-thin", px(b.thin));
    root.style.setProperty("--border-base", px(b.base));
    root.style.setProperty("--border-thick", px(b.thick));
    root.style.setProperty("--border-focus-ring", px(b.focusRing));

    const sz = v.size;
    root.style.setProperty("--size-button-sm", px(sz.buttonSm));
    root.style.setProperty("--size-button-md", px(sz.buttonMd));
    root.style.setProperty("--size-button-lg", px(sz.buttonLg));
    root.style.setProperty("--size-input-sm", px(sz.inputSm));
    root.style.setProperty("--size-input-md", px(sz.inputMd));
    root.style.setProperty("--size-input-lg", px(sz.inputLg));
    root.style.setProperty("--size-navbar-height", px(sz.navbarHeight));
    root.style.setProperty("--size-sidebar-width", px(sz.sidebarWidth));

    const ty = v.typography;
    root.style.setProperty("--font-family-base", ty.fontFamilyBase);
    root.style.setProperty("--font-family-heading", ty.fontFamilyHeading);
    root.style.setProperty("--font-size-xs", px(ty.fontSizeXs));
    root.style.setProperty("--font-size-sm", px(ty.fontSizeSm));
    root.style.setProperty("--font-size-md", px(ty.fontSizeMd));
    root.style.setProperty("--font-size-lg", px(ty.fontSizeLg));
    root.style.setProperty("--font-size-xl", px(ty.fontSizeXl));
    root.style.setProperty("--font-weight-normal", String(ty.fontWeightNormal));
    root.style.setProperty("--font-weight-medium", String(ty.fontWeightMedium));
    root.style.setProperty("--font-weight-bold", String(ty.fontWeightBold));
    root.style.setProperty("--line-height-base", String(ty.lineHeightBase));

    const m = v.motion;
    root.style.setProperty("--duration-fast", `${m.fast}ms`);
    root.style.setProperty("--duration-base", `${m.base}ms`);
    root.style.setProperty("--duration-slow", `${m.slow}ms`);
    root.style.setProperty("--easing-standard", m.easingStandard);

    const z = v.zIndex;
    root.style.setProperty("--z-dropdown", String(z.dropdown));
    root.style.setProperty("--z-sticky", String(z.sticky));
    root.style.setProperty("--z-modal", String(z.modal));
    root.style.setProperty("--z-toast", String(z.toast));
    root.style.setProperty("--z-tooltip", String(z.tooltip));
  }, [base]);
};

export default useBaseVariables;
