import type { ColorTheme } from "../../types";

/**
 * Forest 主题 - 森林绿配色
 * - 主色：翠绿 #1F7A5A，按钮、链接、强调
 * - 深绿底 + 浅绿层级
 */
export const forestColorTheme: ColorTheme = {
  name: "forest",
  displayName: "Forest",
  variables: {
    primary: "#1F7A5A",
    primaryLight: "#E6F2EE",
    primaryFg: "#FFFFFF",

    success: "#1F7A5A",
    successLight: "#E6F2EE",

    info: "#2563EB",
    infoLight: "#E8F0FF",

    warning: "#B45309",
    warningLight: "#FFF4E5",

    danger: "#B42318",
    dangerLight: "#FDECEC",

    // ===== Backgrounds (White-based) =====
    bg: "#FFFFFF",
    bg2: "#F7F9F8",
    bg3: "#EEF3F1",
    bg4: "#E6EFEC",

    // ===== Borders (subtle greys w/ green hint) =====
    border: "#E5E7EB",
    border2: "#D1D5DB",
    border3: "#C7D2CF",
    border4: "#B6C4BF",
    border5: "#1F7A5A", // strong focus border

    // ===== Text =====
    fg: "#111827",
    fgText: "#374151",
    fgHeading: "#0F172A",
    fgHighlight: "#1F7A5A",
    separator: "#E5E7EB",

    temperature: {
      arcFill: ["#E6F2EE", "#A7D8C6", "#4AA987", "#1F7A5A", "#145A43"],
      arcEmpty: "#E5E7EB",
      thumbBg: "#1F7A5A",
      thumbBorder: "#145A43",
    },

    solar: {
      gradientLeft: "#E6F2EE",
      gradientRight: "#1F7A5A",
      shadowColor: "rgba(31, 122, 90, 0.25)",
      secondSeriesFill: "#A7D8C6",
    },

    traffic: {
      tooltipBg: "#FFFFFF",
      tooltipBorderColor: "#E5E7EB",
      tooltipTextColor: "#111827",
      yAxisSplitLine: "#E5E7EB",
      lineBg: "rgba(31, 122, 90, 0.08)",
      itemColor: "#1F7A5A",
      itemBorderColor: "#145A43",
      itemEmphasisBorderColor: "#0E5A41",
      shadowLineDarkBg: "rgba(31, 122, 90, 0.15)",
      shadowLineShadow: "rgba(31, 122, 90, 0.20)",
      gradFrom: "#E6F2EE",
      gradTo: "#1F7A5A",
    },

    electricity: {
      tooltipBg: "#FFFFFF",
      tooltipLineColor: "#1F7A5A",
      tooltipBorderColor: "#E5E7EB",
      tooltipTextColor: "#111827",
      axisLineColor: "#D1D5DB",
      xAxisTextColor: "#374151",
      yAxisSplitLine: "#E5E7EB",
      itemBorderColor: "#145A43",
      lineGradFrom: "#E6F2EE",
      lineGradTo: "#1F7A5A",
      lineShadow: "rgba(31, 122, 90, 0.25)",
      areaGradFrom: "rgba(31, 122, 90, 0.25)",
      areaGradTo: "rgba(31, 122, 90, 0.00)",
      shadowLineDarkBg: "rgba(31, 122, 90, 0.10)",
    },

    echarts: {
      bg: "#FFFFFF",
      textColor: "#111827",
      axisLineColor: "#D1D5DB",
      splitLineColor: "#E5E7EB",
      itemHoverShadowColor: "rgba(31, 122, 90, 0.25)",
      tooltipBackgroundColor: "#FFFFFF",
    },

    chartjs: {
      axisLineColor: "#D1D5DB",
      textColor: "#111827",
    },
  },
};
