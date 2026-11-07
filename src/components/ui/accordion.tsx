"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  openItem: string | null;
  toggleItem: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue>({
  openItem: null,
  toggleItem: () => {},
});

export function Accordion({
  children,
  defaultValue = null,
  className,
}: {
  children: React.ReactNode;
  defaultValue?: string | null;
  className?: string;
}) {
  const [openItem, setOpenItem] = React.useState<string | null>(defaultValue);

  const toggleItem = React.useCallback((value: string) => {
    setOpenItem((prev) => (prev === value ? null : value));
  }, []);

  return (
    <AccordionContext.Provider value={{ openItem, toggleItem }}>
      <div className={cn("divide-y divide-primary/20 border-t border-b border-primary/20", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  title,
  code,
  children,
  className,
}: {
  value: string;
  title: string;
  code?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { openItem, toggleItem } = React.useContext(AccordionContext);
  const isOpen = openItem === value;

  return (
    <div className={cn("transition-colors", isOpen ? "bg-surface" : "hover:bg-surface/60", className)}>
      <button
        type="button"
        onClick={() => toggleItem(value)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-6 px-4 text-left focus-visible:outline-none group cursor-pointer"
      >
        <div className="flex items-baseline gap-4 pr-6">
          {code && (
            <span className="font-mono text-xs font-bold text-accent shrink-0">
              {code}
            </span>
          )}
          <span className="font-display text-lg sm:text-xl font-bold text-primary group-hover:text-accent transition-colors">
            {title}
          </span>
        </div>
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center border border-primary/30 transition-all duration-300",
            isOpen
              ? "bg-primary text-[#F6F3EC] rotate-45 border-primary"
              : "bg-transparent text-primary group-hover:border-primary"
          )}
        >
          <Plus className="h-4 w-4" />
        </span>
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100 pb-6 px-4" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="pl-0 sm:pl-12 pr-4 text-sm sm:text-base text-neutral leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
