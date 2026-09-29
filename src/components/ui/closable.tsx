"use client";

import { createContext, useContext, useState } from "react";

interface ClosableContextType {
  isOpen: boolean;
  close: () => void;
}

const ClosableContext = createContext<ClosableContextType | undefined>(undefined);

export function useClosable() {
  const context = useContext(ClosableContext);

  if (!context) {
    throw new Error("ClosableTrigger harus berada di dalam komponen Closable");
  }

  return context;
}

interface ClosableProps {
  children: React.ReactNode;
}

export function Closable({ children }: ClosableProps) {
  const [isOpen, setIsOpen] = useState(true);

  const close = () => setIsOpen(false);

  if (!isOpen) return null;

  return <ClosableContext.Provider value={{ isOpen, close }}>{children}</ClosableContext.Provider>;
}

interface ClosableTriggerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ClosableTrigger({ children, onClick, ...props }: ClosableTriggerProps) {
  const { close } = useClosable();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    close();
    if (onClick) onClick(e);
  };

  return (
    <div onClick={handleClick} {...props}>
      {children}
    </div>
  );
}
