import * as React from "react";

const DEFAULT_MOBILE_BREAKPOINT = 768;

interface UseIsMobileOptions {
  breakpoint?: number;
}

export function useIsMobile({ breakpoint = DEFAULT_MOBILE_BREAKPOINT }: UseIsMobileOptions = {}) {
  const query = `(max-width: ${breakpoint - 1}px)`;

  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
