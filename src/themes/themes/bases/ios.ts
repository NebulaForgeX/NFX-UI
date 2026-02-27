import type { BaseTheme, BaseVariables } from "../../types";

import { BaseEnum } from "../../types";

/** iOS 风格圆角（较大，如 24） */
export const iosBaseVariables: BaseVariables = {
  buttonRadius: 24,
  cardRadius: 24,
  inputRadius: 24,
};

export const iosBaseTheme: BaseTheme = {
  name: BaseEnum.IOS,
  displayName: "iOS",
  variables: iosBaseVariables,
};
