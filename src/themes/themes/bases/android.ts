import type { BaseTheme, BaseVariables } from "../../types";

import { BaseEnum } from "../../types";

/** Android 风格圆角（如 6） */
export const androidBaseVariables: BaseVariables = {
  buttonRadius: 6,
  cardRadius: 6,
  inputRadius: 6,
};

export const androidBaseTheme: BaseTheme = {
  name: BaseEnum.ANDROID,
  displayName: "Android",
  variables: androidBaseVariables,
};
