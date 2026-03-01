import { useCallback, useState } from "react";

import { getLayoutStorage } from "../utils";

const useAction = () => {
  const [sidebarOpen, setSidebarOpenState] = useState<boolean>(() => {
    const saved = getLayoutStorage();
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.state?.sidebarOpen ?? parsed.sidebarOpen ?? false;
      } catch {
        return false;
      }
    }
    return false;
  });

  const setSidebarOpen = useCallback((open: boolean) => {
    setSidebarOpenState(open);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpenState((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpenState(false);
  }, []);

  return {
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    closeSidebar,
  };
};

export default useAction;
