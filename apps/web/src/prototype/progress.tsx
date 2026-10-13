"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
const ProgressContext = createContext<{
  practiced: boolean;
  markPracticed: () => void;
} | null>(null);
export function PrototypeProgress({ children }: { children: ReactNode }) {
  const [practiced, setPracticed] = useState(false);
  return (
    <ProgressContext.Provider
      value={{ practiced, markPracticed: () => setPracticed(true) }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
export function usePrototypeProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("Prototype progress requires its provider");
  return context;
}
