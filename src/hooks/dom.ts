import { useEffect, useRef, useState } from "react";

/** 防抖值；用于搜索等输入。Debounced value for search inputs etc. */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

/** 鼠标悬停时，将垂直滚轮映射为 horizontal scroll。Maps vertical wheel delta to horizontal scroll while hovered. */
export function useWheelHorizontalScroll<T extends HTMLElement>() {
  const cleanupRef = useRef<Nullable<() => void>>(null);

  const ref = (el: Nullable<T>) => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;

      const { scrollWidth, clientWidth, scrollLeft } = el;
      if (scrollWidth <= clientWidth) return;

      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (delta === 0) return;

      const maxScroll = scrollWidth - clientWidth;
      const atStart = scrollLeft <= 0;
      const atEnd = scrollLeft >= maxScroll - 1;

      if ((delta > 0 && atEnd) || (delta < 0 && atStart)) return;

      event.preventDefault();
      el.scrollLeft += delta;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    cleanupRef.current = () => el.removeEventListener("wheel", onWheel);
  };

  useEffect(
    () => () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    },
    [],
  );

  return ref;
}

const DESKTOP_VIEWPORT_MQ = "(min-width: 901px)";

/** 桌面端锁定 document 滚动（固定视口详情页）；移动端不锁定。Lock document scroll on desktop fixed-viewport detail pages only. */
export function useLockDocumentScrollOnDesktop() {
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_VIEWPORT_MQ);
    const html = document.documentElement;
    const prev = html.style.overflow;

    const apply = () => {
      html.style.overflow = mq.matches ? "hidden" : prev || "";
    };

    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      html.style.overflow = prev;
    };
  }, []);
}
