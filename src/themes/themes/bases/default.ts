import type { BaseTheme, BaseVariables } from "../../types";

import { BaseEnum } from "../../types";

/** 默认基础变量（跨平台通用） */
export const defaultBaseVariables: BaseVariables = {
  buttonRadius: 8,
  cardRadius: 8,
  inputRadius: 6,
};

/** 默认基础主题 */
export const defaultBaseTheme: BaseTheme = {
  name: BaseEnum.DEFAULT,
  displayName: "Default",
  variables: defaultBaseVariables,
};
