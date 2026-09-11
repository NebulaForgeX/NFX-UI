import type { MainWrapperProps } from "../../types";

import { memo } from "react";

const MainWrapper = memo(({ children }: MainWrapperProps) => {
  return <>{children(0, 0)}</>;
});

MainWrapper.displayName = "MainWrapper";
export default MainWrapper;
