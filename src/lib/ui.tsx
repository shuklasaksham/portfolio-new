import { createContext, useContext, useState, type ReactNode } from 'react';

type UI = {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  entered: boolean;
  setEntered: (v: boolean) => void;
};

const Ctx = createContext<UI>(null as unknown as UI);

export function UIProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [entered, setEntered] = useState(true);
  return <Ctx.Provider value={{ menuOpen, setMenuOpen, entered, setEntered }}>{children}</Ctx.Provider>;
}

export const useUI = () => useContext(Ctx);
