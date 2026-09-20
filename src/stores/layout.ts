import { makePersistStore } from "nfx-ui/stores/makeStore";

interface LayoutState {
  headerHeight: number;
  footerHeight: number;
  isAsiderOpen: boolean;
}

interface LayoutActions {
  setHeaderHeight: (headerHeight: number) => void;
  setFooterHeight: (footerHeight: number) => void;
  openAsider: () => void;
  closeAsider: () => void;
  setAsiderOpen: (isAsiderOpen: boolean) => void;
}

const LAYOUT_STORAGE_KEY = "nfx-layout-storage";

const { store: LayoutStore, useStore: useLayoutStore } = makePersistStore<LayoutState, LayoutActions>({
  name: LAYOUT_STORAGE_KEY,
  initialState: {
    headerHeight: 0,
    footerHeight: 0,
    isAsiderOpen: false,
  },
  actions: (set) => ({
    setHeaderHeight: (headerHeight) => set({ headerHeight }),
    setFooterHeight: (footerHeight) => set({ footerHeight }),
    openAsider: () => set({ isAsiderOpen: true }),
    closeAsider: () => set({ isAsiderOpen: false }),
    setAsiderOpen: (isAsiderOpen) => set({ isAsiderOpen }),
  }),
});

const setHeaderHeight = LayoutStore.getState().setHeaderHeight;
const setFooterHeight = LayoutStore.getState().setFooterHeight;
const openAsider = LayoutStore.getState().openAsider;
const closeAsider = LayoutStore.getState().closeAsider;
const setAsiderOpen = LayoutStore.getState().setAsiderOpen;

export { setHeaderHeight, setFooterHeight, openAsider, closeAsider, setAsiderOpen };
export { LayoutStore, useLayoutStore };
