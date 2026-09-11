import type { LayoutSwitcherProps } from "@/designs/layouts/types";

import { memo } from "react";
import { SegmentedControl } from "@radix-ui/themes";

import useLayout from "@/designs/layouts/hooks/useLayout";
import { LAYOUT_MODE_VALUES, LayoutModeEnum } from "@/designs/layouts/types";

const LayoutSwitcher = memo(({ getLayoutDisplayName, handleChangeLayoutMode }: LayoutSwitcherProps) => {
  const { layoutMode, setLayoutMode } = useLayout();
  const getDisplayName = getLayoutDisplayName ?? ((mode: LayoutModeEnum) => mode);

  return (
    <SegmentedControl.Root
      size="1"
      value={layoutMode}
      onValueChange={(next) => {
        const mode = next as LayoutModeEnum;
        setLayoutMode(mode);
        handleChangeLayoutMode?.(mode);
      }}
    >
      {LAYOUT_MODE_VALUES.map((mode) => (
        <SegmentedControl.Item key={mode} value={mode}>
          {getDisplayName(mode)}
        </SegmentedControl.Item>
      ))}
    </SegmentedControl.Root>
  );
});

LayoutSwitcher.displayName = "LayoutSwitcher";
export default LayoutSwitcher;
