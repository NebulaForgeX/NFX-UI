import { useCallback, useEffect, useState } from "react";

import { LAYOUT_STORAGE_KEY, LayoutModeEnum } from "../types";

interface UseSetProps {
  defaultLayoutMode: LayoutModeEnum;
  sidebarOpen: boolean;
}

const useSet = ({ defaultLayoutMode, sidebarOpen }: UseSetProps) => {
  const [layoutMode, setLayoutModeState] = useState<LayoutModeEnum>(() => {
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mode = parsed.state?.layoutMode ?? parsed.layoutMode;
        return mode === LayoutModeEnum.SHOW || mode === LayoutModeEnum.HIDE ? mode : defaultLayoutMode;
      } catch {
        return defaultLayoutMode;
      }
    }
    return defaultLayoutMode;
  });

  useEffect(() => {
    const storage = {
      state: {
        sidebarOpen,
        layoutMode,
      },
    };
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(storage));
  }, [sidebarOpen, layoutMode]);

  const setLayoutMode = useCallback((mode: LayoutModeEnum) => {
    setLayoutModeState(mode);
  }, []);

  return {
    layoutMode,
    setLayoutMode,
  };
};

export default useSet;
