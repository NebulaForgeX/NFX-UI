import type { LayoutSwitcherProps } from "../../types";

import { memo } from "react";

import SlideDownSwitcher from "@/components/SlideDownSwitcher";

import useLayout from "../../hooks/useLayout";
import { LAYOUT_MODE_VALUES, LayoutModeEnum } from "../../types";

const LayoutSwitcher = memo(({ status = "primary", showLabel = "Show", hideLabel = "Hide", handleChangeLayoutMode }: LayoutSwitcherProps) => {
  const { layoutMode, setLayoutMode } = useLayout();

  const getDisplayName = (mode: LayoutModeEnum): string => {
    return mode === LayoutModeEnum.SHOW ? showLabel : hideLabel;
  };

  const handleChange = (mode: LayoutModeEnum) => {
    setLayoutMode(mode);
    handleChangeLayoutMode?.(mode);
  };

  return <SlideDownSwitcher value={layoutMode} options={LAYOUT_MODE_VALUES} getDisplayName={getDisplayName} onChange={handleChange} status={status} />;
});

LayoutSwitcher.displayName = "LayoutSwitcher";

export default LayoutSwitcher;
