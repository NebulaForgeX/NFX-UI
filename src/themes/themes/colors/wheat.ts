import type { ColorTheme } from "../../types";

/** 麦田：在 default 基础上将白红色系改为金黄色系 */
export const wheatColorTheme: ColorTheme = {
  name: "wheat",
  displayName: "麦田",
  variables: {
    // 主色 - 金黄色系
    primary: "rgb(201, 162, 39)", // #C9A227 金黄
    primaryLight: "rgb(230, 200, 120)", // 浅金黄
    primaryFg: "#ffffff",
    success: "rgb(62, 168, 30)",
    successLight: "rgb(220, 255, 210)",
    info: "rgb(220, 180, 80)", // 暖金
    infoLight: "rgb(255, 235, 180)",
    warning: "rgb(218, 165, 32)", // 深金
    warningLight: "rgb(255, 215, 120)",
    danger: "rgb(180, 130, 20)", // 深褐金
    dangerLight: "rgb(220, 180, 80)",

    // 背景色 - 浅色系（与 default 一致）
    bg: "rgb(250, 250, 250)",
    bg2: "rgb(245, 245, 245)",
    bg3: "rgb(226, 224, 224)",
    bg4: "rgb(207, 207, 207)",

    border: "rgb(250, 250, 250)",
    border2: "rgb(245, 245, 245)",
    border3: "rgb(226, 224, 224)",
    border4: "rgb(207, 207, 207)",
    border5: "rgb(136, 136, 136)",

    fg: "rgb(136, 136, 136)",
    fgText: "rgb(22, 21, 21)",
    fgHeading: "rgb(0, 0, 0)",
    fgHighlight: "rgb(201, 162, 39)", // 金黄高亮
    fgOnPrimary: "rgb(250, 250, 250)", // 暂时等于 bg

    separator: "rgb(226, 224, 224)",

    temperature: {
      arcFill: [
        "rgb(255, 245, 210)",
        "rgb(255, 235, 180)",
        "rgb(255, 220, 150)",
        "rgb(230, 200, 120)",
        "rgb(201, 162, 39)",
      ],
      arcEmpty: "rgb(245, 245, 245)",
      thumbBg: "rgb(245, 245, 245)",
      thumbBorder: "rgb(201, 162, 39)",
    },

    solar: {
      gradientLeft: "rgb(201, 162, 39)",
      gradientRight: "rgb(218, 165, 32)",
      shadowColor: "rgba(201, 162, 39, 0.1)",
      secondSeriesFill: "rgb(245, 245, 245)",
    },

    traffic: {
      tooltipBg: "rgb(250, 250, 250)",
      tooltipBorderColor: "rgb(245, 245, 245)",
      tooltipTextColor: "rgb(22, 21, 21)",
      yAxisSplitLine: "rgb(226, 224, 224)",
      lineBg: "rgb(207, 207, 207)",
      itemColor: "rgb(207, 207, 207)",
      itemBorderColor: "rgb(207, 207, 207)",
      itemEmphasisBorderColor: "rgb(201, 162, 39)",
      shadowLineDarkBg: "rgba(0, 0, 0, 0)",
      shadowLineShadow: "rgba(0, 0, 0, 0)",
      gradFrom: "rgb(245, 245, 245)",
      gradTo: "rgb(245, 245, 245)",
    },

    electricity: {
      tooltipBg: "rgb(250, 250, 250)",
      tooltipLineColor: "rgb(22, 21, 21)",
      tooltipBorderColor: "rgb(245, 245, 245)",
      tooltipTextColor: "rgb(22, 21, 21)",
      axisLineColor: "rgb(226, 224, 224)",
      xAxisTextColor: "rgb(136, 136, 136)",
      yAxisSplitLine: "rgb(226, 224, 224)",
      itemBorderColor: "rgb(201, 162, 39)",
      lineGradFrom: "rgb(201, 162, 39)",
      lineGradTo: "rgb(218, 165, 32)",
      lineShadow: "rgba(201, 162, 39, 0.2)",
      areaGradFrom: "rgba(201, 162, 39, 0.1)",
      areaGradTo: "rgba(201, 162, 39, 0.05)",
      shadowLineDarkBg: "rgba(0, 0, 0, 0)",
    },

    echarts: {
      bg: "rgb(250, 250, 250)",
      textColor: "rgb(22, 21, 21)",
      axisLineColor: "rgb(136, 136, 136)",
      splitLineColor: "rgb(226, 224, 224)",
      itemHoverShadowColor: "rgba(201, 162, 39, 0.3)",
      tooltipBackgroundColor: "rgb(201, 162, 39)",
    },

    chartjs: {
      axisLineColor: "rgb(226, 224, 224)",
      textColor: "rgb(22, 21, 21)",
    },
  },
};
