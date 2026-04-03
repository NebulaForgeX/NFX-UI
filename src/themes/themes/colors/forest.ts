import type { ColorTheme } from "../../types";

/**
 * Forest — White + green accent
 * 与 Default 共用同一套白底与 Tailwind gray 中性色；仅将 Default 中的主色/强调红系替换为对应层级的绿色点缀。
 * Primary scale mirrors Default’s red scale → green-50 … green-700（品牌绿 #15803D）。
 */
export const forestColorTheme: ColorTheme = {
  name: "forest",
  displayName: "Forest",
  variables: {
    primary: "#15803D",
    primaryHover: "#166534",
    primaryLight: "#86EFAC",
    primaryBg: "#F0FDF4",
    primaryRgb: "21, 128, 61",
    primaryTransparent: "rgba(21, 128, 61, 0.15)",
    primaryFg: "#FFFFFF",

    success: "#16A34A",
    successLight: "#DCFCE7",
    successRgb: "22, 163, 74",
    info: "#2563EB",
    infoLight: "#DBEAFE",
    infoRgb: "37, 99, 235",
    warning: "#D97706",
    warningLight: "#FEF3C7",
    warningRgb: "217, 119, 6",
    danger: "#EF4444",
    dangerLight: "#FEE2E2",
    dangerRgb: "239, 68, 68",

    bg: "#FFFFFF",
    bg2: "#F9FAFB",
    bg3: "#F3F4F6",
    bg4: "#E5E7EB",
    bgSecondary: "#F0FDF4",

    border: "#F3F4F6",
    border2: "#E5E7EB",
    border3: "#D1D5DB",
    border4: "#9CA3AF",
    border5: "#6B7280",
    borderHover: "#15803D",

    fg: "#9CA3AF",
    fgText: "#1F2937",
    fgHeading: "#111827",
    fgHighlight: "#15803D",
    fgMuted: "#6B7280",
    fgOnPrimary: "#FFFFFF",

    separator: "#E5E7EB",

    overlay: "rgba(0, 0, 0, 0.5)",
    shadow: "rgba(0, 0, 0, 0.08)",
    ring: "#15803D",

    chart1: "#15803D",
    chart2: "#2563EB",
    chart3: "#16A34A",
    chart4: "#D97706",
    chart5: "#7C3AED",

    temperature: {
      arcFill: ["#DCFCE7", "#86EFAC", "#4ADE80", "#22C55E", "#15803D"],
      arcEmpty: "#F3F4F6",
      thumbBg: "#FFFFFF",
      thumbBorder: "#15803D",
    },

    solar: {
      gradientLeft: "#15803D",
      gradientRight: "#F97316",
      shadowColor: "rgba(21, 128, 61, 0.12)",
      secondSeriesFill: "#F3F4F6",
    },

    traffic: {
      tooltipBg: "#FFFFFF",
      tooltipBorderColor: "#E5E7EB",
      tooltipTextColor: "#1F2937",
      yAxisSplitLine: "#F3F4F6",
      lineBg: "#E5E7EB",
      itemColor: "#D1D5DB",
      itemBorderColor: "#D1D5DB",
      itemEmphasisBorderColor: "#15803D",
      shadowLineDarkBg: "rgba(0, 0, 0, 0)",
      shadowLineShadow: "rgba(0, 0, 0, 0)",
      gradFrom: "#F0FDF4",
      gradTo: "#FFFFFF",
    },

    electricity: {
      tooltipBg: "#FFFFFF",
      tooltipLineColor: "#1F2937",
      tooltipBorderColor: "#E5E7EB",
      tooltipTextColor: "#1F2937",
      axisLineColor: "#E5E7EB",
      xAxisTextColor: "#6B7280",
      yAxisSplitLine: "#F3F4F6",
      itemBorderColor: "#15803D",
      lineGradFrom: "#15803D",
      lineGradTo: "#F97316",
      lineShadow: "rgba(21, 128, 61, 0.2)",
      areaGradFrom: "rgba(21, 128, 61, 0.1)",
      areaGradTo: "rgba(21, 128, 61, 0.02)",
      shadowLineDarkBg: "rgba(0, 0, 0, 0)",
    },

    echarts: {
      bg: "#FFFFFF",
      textColor: "#1F2937",
      axisLineColor: "#9CA3AF",
      splitLineColor: "#F3F4F6",
      itemHoverShadowColor: "rgba(21, 128, 61, 0.25)",
      tooltipBackgroundColor: "#15803D",
    },

    chartjs: {
      axisLineColor: "#E5E7EB",
      textColor: "#1F2937",
    },
  },
};
