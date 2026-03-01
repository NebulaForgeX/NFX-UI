import type { LayoutSwitcherProps } from "@/designs/layouts/types";

import { memo } from "react";

import useLayout from "@/designs/layouts/hooks/useLayout";
import { LAYOUT_MODE_VALUES, LayoutModeEnum } from "@/designs/layouts/types";

import SlideDownSwitcher from "../SlideDownSwitcher";

const LayoutSwitcher = memo(({ status = "primary", getLayoutDisplayName, handleChangeLayoutMode }: LayoutSwitcherProps) => {
  const { layoutMode, setLayoutMode } = useLayout();

  const getDisplayName = getLayoutDisplayName ?? ((mode: LayoutModeEnum) => mode);

  const handleChange = (mode: LayoutModeEnum) => {
    setLayoutMode(mode);
    handleChangeLayoutMode?.(mode);
  };

  return <SlideDownSwitcher value={layoutMode} options={LAYOUT_MODE_VALUES} getDisplayName={getDisplayName} onChange={handleChange} status={status} />;
});

LayoutSwitcher.displayName = "LayoutSwitcher";

export default LayoutSwitcher;
