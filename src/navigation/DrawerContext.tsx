import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

interface DrawerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

/**
 * The slide-out menu is navigation chrome rather than app state, so it lives in
 * context next to the navigators instead of in a Redux slice.
 */
export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<DrawerContextValue>(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
};

export const useDrawer = (): DrawerContextValue => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used inside a DrawerProvider");
  }
  return context;
};
